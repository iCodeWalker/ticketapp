import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@vkticketscommon/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setUp = async () => {
  /** Create an instance of the listener */
  const listener = new OrderCreatedListener(natsWrapper.client);

  /** Create and save a ticket */
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 20,
    userId: "123",
  });
  await ticket.save();

  /** Creata a fake data object */
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "1223",
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket._id.toString(),
      price: ticket.price,
    },
  };

  /** Create a fake message object */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket._id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setUp();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );

  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
