import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@vkticketscommon/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    /** Find an order  */
    const order = await Order.findById(orderId);

    /** If no order found */
    if (!order) {
      throw new NotFoundError();
    }
    /** Checkong if the order user making the payment for is his or not */
    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    /** Checking if order is cancelled */
    if (order!.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    /** create a charge */
    // await stripe.charges.create({
    //   currency: "inr",
    //   amount: order.price * 100,
    //   source: token,
    //   description: "Payment for ticket app",
    // });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "inr",
      payment_method: token,
      confirm: true,

      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },

      description: "Payment for ticket app",
    });

    /** Creating a payment doc */
    const payment = Payment.build({
      orderId: orderId,
      stripeId: paymentIntent.id,
    });

    await payment.save();

    /** Publishing a payment created event */
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment._id.toString(),
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({
      success: true,
      paymentIntentId: paymentIntent.id,
    });
  },
);

export { router as createChargeRouter };
