'use strict';
import { calculatePrice } from '../../pricing/services/pricing';


async function getTemplatesByShopIds(shopIds) {
    if (!shopIds.length) return {};

    const pricings = await strapi.db
        .query('api::print-shop-product-pricing.print-shop-product-pricing')
        .findMany({
            where: {
                print_shop: { id: { $in: shopIds } },
                is_active: true,
            },
            populate: {
                product_template: {
                    select: ['name'],
                },
                print_shop: {
                    select: ['id'],
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

    Object.keys(map).forEach(
        (key) => (map[key] = Array.from(map[key]))
    );

    return map;
}

/**
 * Helper: radno vreme + real-time status
 */
function getTodayWorkingTime(workingHours) {
    if (!workingHours) {
        return {
            working_time_today: '',
            is_open_today: false,
            is_open_now: false,
        };
    }

    const daysMap = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    const todayKey = daysMap[new Date().getDay()];
    const today = workingHours[todayKey];
    if (!today || !today.from || !today.to) {
        return {
            working_time_today: '',
            is_open_today: false,
            is_open_now: false,
        };
    }

    const now = new Date();
    const [fromH, fromM] = today.from.split(':').map(Number);
    const [toH, toM] = today.to.split(':').map(Number);

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
            selectedOptions = '{}',
        } = ctx.query;

        let parsedOptions = {};
        try {
            parsedOptions =
                typeof selectedOptions === 'string'
                    ? JSON.parse(selectedOptions)
                    : selectedOptions;
        } catch {
            return ctx.badRequest('selectedOptions must be valid JSON');
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
                .query('api::print-shop.print-shop')
                .findMany({
                    where: { is_active: true },
                    select: [
                        'id',
                        'name',
                        'city',
                        'email',
                        'address',
                        'working_hours',
                    ],
                });

            const templateMap = await getTemplatesByShopIds(
                shops.map((s) => s.id)
            );

            return shops.map((shop) => {
                const workingTime = getTodayWorkingTime(
                    shop.working_hours
                );

                return {
                    id: shop.id,
                    name: shop.name,
                    city: shop.city,
                    email: shop.email,
                    address: shop.address,
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
                'productTemplateId is required when filtering shops'
            );
        }

        const pricings = await strapi.db
            .query(
                'api::print-shop-product-pricing.print-shop-product-pricing'
            )
            .findMany({
                where: {
                    product_template: productTemplateId,
                    is_active: true,
                    print_shop: { is_active: true },
                },
                populate: {
                    print_shop: {
                        select: [
                            'id',
                            'name',
                            'city',
                            'email',
                            'address',
                            'working_hours',
                        ],
                    },
                    product_template: {
                        select: ['id', 'name', 'allowed_options'],
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
                    (Number(pricing.base_price) + calculated) * qty;

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
                    templates: templateMap[pricing.print_shop.id] || [],
                    ...workingTime,
                };
            })
        );

    },
};
