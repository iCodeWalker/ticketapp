import { OrderCancelledEvent, OrderStatus } from "@vkticketscommon/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setUp = async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  /** Create an instance of the listener */
  const listener = new OrderCancelledListener(natsWrapper.client);

  /** Create and save a ticket */
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 20,
    userId: "123",
  });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket._id.toString(),
    },
  };

  /** Create a fake message object */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, ticket, data, msg } = await setUp();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket._id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
