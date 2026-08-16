import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@vkticketscommon/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 if the order one trying to purchase does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({
      token: "1234",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("return a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie())
    .send({
      token: "123123",
      orderId: order._id.toString(),
    });
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 10,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userId))
    .send({
      orderId: order._id,
      token: "121331",
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // const price = Math.floor(Math.random()* 100000)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    // price: price,
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.getAuthCookie(userId))
    .send({
      token: "pm_card_visa",
      orderId: order._id,
    })
    .expect(201);

  const paymentIntentOptions = await (stripe.paymentIntents.create as jest.Mock)
    .mock.calls[0][0];

  expect(paymentIntentOptions.payment_method).toEqual("pm_card_visa");
  expect(paymentIntentOptions.amount).toEqual(order.price * 100);
  expect(paymentIntentOptions.currency).toEqual("inr");

  /** Expectation when integarting with real stripe api */

  /**
   * Listing recent 10 payment intents and finding out the current intent using the price
   *
   * const paymentIntents = await stripe.paymentIntents.list({limit : 50});
   *
   * const stripePaymentIntent = paymentIntents.data.find((intent) => {
   *  return intent.amount === price*100
   * })
   *
   * expect(stripePaymentIntent).toBeDefined();
   * expect(stripePaymentIntent!.currency).toEqual("inr")
   */

  console.log(paymentIntentOptions, "paymentIntentOptions");
  const payment = await Payment.findOne({
    orderId: order._id.toString(),
    stripeId: "pi_test_123",
  });

  expect(payment).not.toBeNull();
});
