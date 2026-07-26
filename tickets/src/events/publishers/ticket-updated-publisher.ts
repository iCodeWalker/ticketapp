import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@vkticketscommon/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
}
