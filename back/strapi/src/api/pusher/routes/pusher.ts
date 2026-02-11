module.exports = {
  routes: [
    {
      method: "POST",
      path: "/pusher/auth",
      handler: "pusher.auth",
      config: {
        auth: { required: true },
        policies: ["api::print-shop.is-shop-owner"],
      },
    },
  ],
};
