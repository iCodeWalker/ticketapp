import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vkticketscommon/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        /** To check if the provided ticketId is a valid mongo id or not */
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("Ticket id must be provided"),
  ],
  async (req: Request, res: Response) => {
    /** 1. Find the ticket the user is trying to order in the database  */
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }
    /** 2. Make sure the ticket is not blocked by some other user */
    /**
     * Run query to look for all orders
     * Find an order where the ticket is the ticket wwe just found, and the status of the order is not cancelled
     * If we found some order than the ticket is already blocked by some other user
     */
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // });

    // if (existingOrder) {
    //   throw new BadRequestError("Ticket is already blocked");
    // }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already blocked");
    }

    /** 3. Calculate an expiration date for the order  */
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    /** 4. Build the order and save it to the database */
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    /** 5. Publish an event to say an other has been created */
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order._id.toString(),
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
