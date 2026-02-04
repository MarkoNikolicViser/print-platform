'use strict';

export default async (policyContext, config, { strapi }) => {
    const jwtUser = policyContext.state.user;

    if (!jwtUser) return false;

    const user = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        jwtUser.id,
        {
            populate: ['print_shop_id'], // 👈 BITNO
        }
    );

    console.log('USER:', user);

    if (!user) return false;
    if (user.app_role !== 'shop') return false;
    if (!user.print_shop_id) return false;

    policyContext.state.printShopId = user.print_shop_id.id;

    return true;
};