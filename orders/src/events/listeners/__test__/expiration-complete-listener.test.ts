import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderStatus } from "../../../models/order";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent } from "@vkticketscommon/common";

const setUp = async () => {
  const listner = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test 1",
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order._id.toString(),
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listner,
    order,
    ticket,
    data,
    msg,
  };
};

it("updates the order status to cancel", async () => {
  const { listner, order, ticket, data, msg } = await setUp();

  await listner.onMessage(data, msg);

  const updatedOrder = await Order.findById(order._id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit order cancelled event", async () => {
  const { listner, order, ticket, data, msg } = await setUp();
  await listner.onMessage(data, msg);

  /** 1st level check: to check if the event was called */
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  /** calls is the array of all the different times the function was invoked  */

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );

  /** 2nd level check: to check if it is called with valid arguments */
  expect(eventData!.id).toEqual(order._id.toString());
});

it("ack the message", async () => {
  const { listner, order, ticket, data, msg } = await setUp();
  await listner.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
