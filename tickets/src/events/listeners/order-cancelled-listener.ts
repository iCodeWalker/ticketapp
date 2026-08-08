import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@vkticketscommon/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id.toString(),
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      ...(ticket.orderId && { orderId: ticket.orderId }),
      version: ticket.version,
    });

    msg.ack();
  }
}
