import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@vkticketscommon/common";
import { Message } from "node-nats-streaming";

const setUp = async () => {
  /** Create an instance of the listener */
  const listener = new TicketUpdatedListener(natsWrapper.client);
  /**Create and save a ticket */
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 20,
  });
  await ticket.save();
  /** Create a fake data event */
  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id.toString(),
    version: ticket.version + 1,
    title: "Updated Ticket",
    price: 25,
    userId: "123",
  };
  /** Create a fake message object */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  /**Return all things */
  return { listener, ticket, data, msg };
};

it("finds, update and save a ticket", async () => {
  const { msg, data, ticket, listener } = await setUp();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket._id);
  expect(updatedTicket!.title).not.toEqual(ticket.title);
  expect(updatedTicket!.price).not.toEqual(ticket.price);
  expect(updatedTicket!.version).not.toEqual(ticket.version);
});

it("acks the message", async () => {
  const { msg, data, ticket, listener } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("deos not call ack if the event is in the future", async () => {
  const { msg, data, ticket, listener } = await setUp();

  data.version = ticket.version + 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
