import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@vkticketscommon/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
