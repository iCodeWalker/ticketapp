import Stripe from "stripe";

/** Creating an instance of the stripe and export it so that we can use it in other files */

export const stripe: Stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});
