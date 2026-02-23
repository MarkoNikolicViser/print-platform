"use strict";

module.exports = {
  async createOrder(ctx) {
    const { amount } = ctx.request.body;

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
            ).toString("base64"),
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: amount,
              },
            },
          ],
        }),
      }
    );

    const data = await response.json();
    ctx.send(data);
  },
};
