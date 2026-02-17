"use strict";
import { calculatePrice } from "../../pricing/services/pricing";

async function getTemplatesByShopIds(shopIds) {
  if (!shopIds.length) return {};

  const pricings = await strapi.db
    .query("api::print-shop-product-pricing.print-shop-product-pricing")
    .findMany({
      where: {
        print_shop: { id: { $in: shopIds } },
        is_active: true,
      },
      populate: {
        product_template: {
          select: ["name"],
        },
        print_shop: {
          select: ["id"],
        },
      },
    });

  const map = {};

  for (const pricing of pricings) {
    const shopId = pricing.print_shop.id;
    const templateName = pricing.product_template?.name;

    if (!templateName) continue;

    if (!map[shopId]) {
      map[shopId] = new Set();
    }

    map[shopId].add(templateName);
  }

  Object.keys(map).forEach((key) => (map[key] = Array.from(map[key])));

  return map;
}

/**
 * Helper: radno vreme + real-time status
 */
function getTodayWorkingTime(workingHours) {
  if (!workingHours) {
    return {
      working_time_today: "",
      is_open_today: false,
      is_open_now: false,
    };
  }

  const daysMap = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const todayKey = daysMap[new Date().getDay()];
  const today = workingHours[todayKey];
  if (!today || !today.from || !today.to) {
    return {
      working_time_today: "",
      is_open_today: false,
      is_open_now: false,
    };
  }

  const now = new Date();
  const [fromH, fromM] = today.from.split(":").map(Number);
  const [toH, toM] = today.to.split(":").map(Number);

  const fromTime = new Date(now);
  fromTime.setHours(fromH, fromM, 0, 0);

  const toTime = new Date(now);
  toTime.setHours(toH, toM, 0, 0);
  const isOpenNow = now >= fromTime && now <= toTime;
  return {
    working_time_today: `${today.from} - ${today.to}`,
    is_open_today: true,
    is_open_now: isOpenNow,
  };
}

module.exports = {
  async listShops(ctx) {
    const {
      productTemplateId,
      numberOfPages = 1,
      quantity = 1,
      selectedOptions = "{}",
    } = ctx.query;

    let parsedOptions = {};
    try {
      parsedOptions =
        typeof selectedOptions === "string"
          ? JSON.parse(selectedOptions)
          : selectedOptions;
    } catch {
      return ctx.badRequest("selectedOptions must be valid JSON");
    }

    const hasParams =
      !!productTemplateId ||
      ctx.query.numberOfPages ||
      ctx.query.quantity ||
      ctx.query.selectedOptions;

    /**
     * 🟦 BEZ PARAMETARA
     */
    if (!hasParams) {
      const shops = await strapi.db
        .query("api::print-shop.print-shop")
        .findMany({
          where: { is_active: true },
          select: ["id", "name", "city", "email", "address", "working_hours", "longitude", "latitude"],
        });

      const templateMap = await getTemplatesByShopIds(shops.map((s) => s.id));

      return shops.map((shop) => {
        const workingTime = getTodayWorkingTime(shop.working_hours);

        return {
          id: shop.id,
          name: shop.name,
          city: shop.city,
          email: shop.email,
          address: shop.address,
          latitude: shop.latitude,
          longitude: shop.longitude,
          templates: templateMap[shop.id] || [],
          ...workingTime,
        };
      });
    }

    /**
     * 🟩 SA PARAMETRIMA
     */
    if (!productTemplateId) {
      return ctx.badRequest(
        "productTemplateId is required when filtering shops"
      );
    }

    const pricings = await strapi.db
      .query("api::print-shop-product-pricing.print-shop-product-pricing")
      .findMany({
        where: {
          product_template: productTemplateId,
          is_active: true,
          print_shop: { is_active: true },
        },
        populate: {
          print_shop: {
            select: ["id", "name", "city", "email", "address", "working_hours", "longitude", "latitude"],
          },
          product_template: {
            select: ["id", "name", "allowed_options"],
          },
        },
      });

    const shopIds = pricings.map((p) => p.print_shop.id);
    const templateMap = await getTemplatesByShopIds(shopIds);

    return await Promise.all(
      pricings.map(async (pricing) => {
        const pages = Number(numberOfPages) || 1;
        const qty = Number(quantity) || 1;
        const calculated = await calculatePrice({
          printShopId: pricing.print_shop.id,
          productTemplate: pricing.product_template,
          pricing: {
            rules: pricing.option_price_modifiers,
          },
          document: {
            pages,
          },
          options: parsedOptions,
        });

        const totalPrice =
          (Number(pricing.base_price) + calculated) * qty * pages;

        const workingTime = getTodayWorkingTime(
          pricing.print_shop.working_hours
        );
        return {
          id: pricing.print_shop.id,
          name: pricing.print_shop.name,
          city: pricing.print_shop.city,
          email: pricing.print_shop.email,
          address: pricing.print_shop.address,
          total_price: totalPrice,
          latitude: pricing.print_shop.latitude,
          longitude: pricing.print_shop.longitude,
          templates: templateMap[pricing.print_shop.id] || [],
          ...workingTime,
        };
      })
    );
  },
  async me(ctx) {
    const printShopId = ctx.state.printShopId;

    if (!printShopId) {
      return ctx.unauthorized('No shop linked');
    }

    const printShop = await strapi.entityService.findOne(
      'api::print-shop.print-shop',
      printShopId,
      {
        populate: {
          print_shop_prices: true,
        },
      }
    );

    if (!printShop) {
      return ctx.notFound('Print shop not found');
    }

    return {
      id: printShop.id,
      name: printShop.name,
      address: printShop.address,
      city: printShop.city,
      email: printShop.email,
      phone: printShop.phone,
      is_active: printShop.is_active,
      working_hours: printShop.working_hours,
      latitude: printShop.latitude,
      longitude: printShop.longitude,
      stats: {
        total_completed_orders: printShop.total_completed_orders,
        on_time_rate: printShop.on_time_rate,
      },
    };
  },
  async updateMe(ctx) {
    const printShopId = ctx.state.printShopId;

    if (!printShopId) {
      return ctx.unauthorized('No shop linked');
    }

    const allowedFields = [
      'name',
      'address',
      'city',
      'phone',
      'working_hours',
      'latitude',
      'longitude',
    ];

    const data = Object.keys(ctx.request.body).reduce((acc, key) => {
      if (allowedFields.includes(key)) {
        acc[key] = ctx.request.body[key];
      }
      return acc;
    }, {} as Record<string, any>);

    // Optional safety: ensure lat/lng are numbers
    if (data.latitude !== undefined) {
      data.latitude = Number(data.latitude);
    }

    if (data.longitude !== undefined) {
      data.longitude = Number(data.longitude);
    }

    const updated = await strapi.entityService.update(
      'api::print-shop.print-shop',
      printShopId,
      { data }
    );

    return {
      id: updated.id,
      name: updated.name,
      address: updated.address,
      city: updated.city,
      phone: updated.phone,
      working_hours: updated.working_hours,
      latitude: updated.latitude,
      longitude: updated.longitude,
    };
  },
  async createMe(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('Unauthorized');
    }

    if (user.print_shop_id) {
      return ctx.badRequest('Print shop already exists');
    }

    const {
      name,
      address,
      city,
      phone,
      working_hours,
      latitude,
      longitude,
      email,
      bank_account
    } = ctx.request.body;

    if (!name || !address) {
      return ctx.badRequest('Name and address are required');
    }

    // 1️⃣ Kreiraj shop
    const created = await strapi
      .documents('api::print-shop.print-shop')
      .create({
        data: {
          name,
          address,
          city,
          phone,
          working_hours,
          email,
          bank_account,
          is_active: true,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
        },
      });

    // 2️⃣ Poveži ga sa user-om
    await strapi
      .documents('plugin::users-permissions.user')
      .update({
        documentId: user.documentId,
        data: {
          print_shop_id: created.id,
          app_role: 'shop',
        },
      });

    return created;
  },
};
