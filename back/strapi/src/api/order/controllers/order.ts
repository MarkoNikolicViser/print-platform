"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const { v4: uuid } = require("uuid");
import { calculatePrice } from "../../pricing/services/pricing";

const isOrderExpired = (order) => {
  if (!order) return true;
  if (order.status_code !== "draft") return false;
  if (!order.expires_at) return false;
  return new Date(order.expires_at) < new Date();
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async addToCart(ctx) {
    const {
      order_code,
      product_template_id,
      selected_options,
      quantity = 1,
      print_shop_id,
      customer_email,
      customer_phone,
      documents = [],
    } = ctx.request.body;

    const orderItemService = strapi.service("api::order-item.order-item");

    try {
      const result = await strapi.db.transaction(async ({ trx }) => {

        let order = null;

        // 1️⃣ Existing order
        if (order_code) {
          const existingOrder = await strapi.db
            .query("api::order.order")
            .findOne({
              where: { order_code },
              populate: ["order_items"],
              transacting: trx,
            });

          if (existingOrder && !orderItemService.isOrderExpired(existingOrder)) {
            order = existingOrder;
          }
        }

        // 2️⃣ Create order if needed
        if (!order) {
          order = await strapi.db.query("api::order.order").create({
            data: {
              order_code: uuid(),
              status_code: "draft",
              total_price: 0,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
              print_shop_id,
              customer_email,
              customer_phone,
            },
            transacting: trx,
          });
        }

        // 3️⃣ Parse options
        let parsedOptions = {};
        if (selected_options) {
          parsedOptions =
            typeof selected_options === "string"
              ? JSON.parse(selected_options)
              : selected_options;
        }

        const qty = Number(quantity) || 1;

        // 4️⃣ Fetch product template
        const productTemplate = await strapi.db
          .query("api::product-template.product-template")
          .findOne({
            where: { id: product_template_id },
            transacting: trx,
          });

        if (!productTemplate) {
          throw new Error("Product template not found");
        }

        // 5️⃣ Fetch pricing
        const pricingConfig = await strapi.db
          .query("api::print-shop-product-pricing.print-shop-product-pricing")
          .findOne({
            where: {
              print_shop: print_shop_id,
              product_template: product_template_id,
              is_active: true,
            },
            transacting: trx,
          });

        if (!pricingConfig?.option_price_modifiers) {
          throw new Error("Pricing not configured for this product");
        }

        // 6️⃣ Insert items individually (relations will work)
        const createdItems = [];

        for (const doc of documents) {
          const pages = Number(doc.pages) || 1;

          const optionPrice = await calculatePrice({
            printShopId: print_shop_id,
            productTemplate,
            pricing: { rules: pricingConfig.option_price_modifiers },
            document: { pages },
            options: parsedOptions,
          });

          const unitPrice = Number(pricingConfig.base_price) + optionPrice;
          const totalItemPrice = unitPrice * qty * pages;

          const orderItem = await strapi.db.query("api::order-item.order-item").create({
            data: {
              order: order.id, // relations work here
              product_template: product_template_id, // relations work here

              selected_options: parsedOptions,
              quantity: qty,

              document_url: doc.url,
              document_name: doc.name,
              document_pages: pages,
              document_mime: doc.mime,

              unit_price: unitPrice,
              total_price: totalItemPrice,
            },
            transacting: trx,
          });

          createdItems.push(orderItem);
        }

        // 7️⃣ Recalculate order total
        const allItems = await strapi.db
          .query("api::order-item.order-item")
          .findMany({
            where: { order: order.id },
            transacting: trx,
          });

        const orderTotal = allItems.reduce(
          (sum, item) => sum + Number(item.total_price),
          0
        );

        await strapi.db.query("api::order.order").update({
          where: { id: order.id },
          data: { total_price: orderTotal },
          transacting: trx,
        });

        return order;
      });

      // 8️⃣ Response
      const response = await orderItemService.buildItemsByOrderResponse(
        result.order_code
      );

      if (response?.expired) {
        ctx.status = 410;
        return ctx.send({
          message: "Order has expired",
          expired: true,
          expiresAt: response.expiresAt,
        });
      }

      return ctx.send(response);
    } catch (err) {
      strapi.log.error(err);
      return ctx.badRequest(err.message);
    }
  },
  async accept(ctx) {
    const { orderId } = ctx.params;
    const { estimated_minutes } = ctx.request.body;

    if (!estimated_minutes || estimated_minutes <= 0) {
      return ctx.badRequest("Estimated minutes required");
    }

    const now = new Date();
    const estimatedCompletion = new Date(
      now.getTime() + estimated_minutes * 60 * 1000
    );

    const order = await strapi.db.query("api::order.order").update({
      where: { id: orderId },
      data: {
        status_code: "accepted",
        estimated_completion_at: estimatedCompletion,
      },
    });

    ctx.send({ order });
  },

  async markReady(ctx) {
    const { orderId } = ctx.params;

    const order = await strapi.db.query("api::order.order").findOne({
      where: { id: orderId },
      populate: ["print_shop"],
    });

    if (!order || !order.estimated_completion_at) {
      return ctx.badRequest("Order not ready for completion");
    }

    const completedAt = new Date();
    const completedOnTime =
      completedAt <= new Date(order.estimated_completion_at);

    // 1️⃣ Update order
    await strapi.db.query("api::order.order").update({
      where: { id: orderId },
      data: {
        status_code: "ready",
        completed_at: completedAt,
        completed_on_time: completedOnTime,
      },
    });

    // 2️⃣ Update print shop statistike
    const shop = order.print_shop;

    const total = shop.total_completed_orders + 1;
    const onTime = completedOnTime ? 1 : 0;

    const newRate =
      (shop.on_time_rate * shop.total_completed_orders + onTime) / total;

    await strapi.db.query("api::print-shop.print-shop").update({
      where: { id: shop.id },
      data: {
        total_completed_orders: total,
        on_time_rate: Number(newRate.toFixed(2)),
      },
    });

    ctx.send({ completedOnTime });
  },
  async findForMyShop(ctx) {
    const printShopId = ctx.state.printShopId;

    if (!printShopId) {
      return ctx.forbidden("Print shop context missing");
    }

    const orders = await strapi.db.query("api::order.order").findMany({
      where: {
        print_shop_id: printShopId,
        status_code: {
          $in: ["paid", "printing", "ready", "picked_up"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      populate: {
        order_items: {
          populate: {
            product_template: {
              select: ["id", "name", "allowed_options"],
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      order_code: order.order_code,
      status_code: order.status_code,
      finish_code: order.finish_code,
      total_price: order.total_price,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      expires_at: order.expires_at,
      estimated_completion_at: order.estimated_completion_at,
      completed_at: order.completed_at,
      completed_on_time: order.completed_on_time,
      createdAt: order.createdAt,

      items: order.order_items.map((item) => {
        const template = item.product_template;
        const allowedOptions = template?.allowed_options || {};

        /**
         * Mapiranje selected_options -> sa labelama
         */
        const selected_options_with_labels = Object.entries(
          item.selected_options || {}
        ).map(([key, value]) => {
          const optionDef = allowedOptions[key];

          if (!optionDef) {
            return {
              key,
              value,
              label: key,
              optionLabel: String(value),
            };
          }

          const matchedOption = optionDef.options?.find(
            (opt) => opt.value === value
          );

          return {
            key,
            value,
            label: optionDef.label,
            optionLabel: matchedOption ? matchedOption.label : String(value),
          };
        });

        return {
          id: item.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          status_code: item.status_code,
          document_name: item.document_name,
          document_url: item.document_url,
          document_pages: item.document_pages,
          document_mime: item.document_mime,

          selected_options: item.selected_options,
          selected_options_with_labels,

          product_template: template
            ? {
              id: template.id,
              name: template.name,
            }
            : null,
        };
      }),
    }));
  },
  async checkStatus(ctx) {
    const { order_code } = ctx.query;

    if (!order_code) return ctx.badRequest('Missing order_code');

    const order = await strapi.db.query('api::order.order').findOne({
      where: { order_code },
    });

    if (!order) return ctx.notFound();

    ctx.send({
      status_code: order.status_code,
    });
  }
}));
