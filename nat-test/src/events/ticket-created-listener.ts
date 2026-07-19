import nats, { Message, Stan } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated; // "ticket:created"; // Channel name
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data:", data);

    msg.ack();
  }
}
