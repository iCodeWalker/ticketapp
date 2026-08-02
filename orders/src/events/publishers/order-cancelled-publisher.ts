import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@vkticketscommon/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
