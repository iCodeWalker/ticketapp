import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { TicketCreatedEvent } from "@vkticketscommon/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setUp = async () => {
  /** Create an instance of the listener */
  const listener = new TicketCreatedListener(natsWrapper.client);
  /** Create a fake data event */
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  };
  /** Create a fake message object */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and save a ticket", async () => {
  const { listener, data, msg } = await setUp();
  /** Call the onMessage function with the data object and message object */
  await listener.onMessage(data, msg);
  /** Write assertions to verify the ticket was created and saved */
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setUp();
  /** Call the onMessage function with the data object and message object */
  await listener.onMessage(data, msg);
  /** Write assertions to make sure ack function was called */
  expect(msg.ack).toHaveBeenCalled();
});
