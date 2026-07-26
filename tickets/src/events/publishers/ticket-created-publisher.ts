import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@vkticketscommon/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}
