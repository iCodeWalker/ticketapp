import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@vkticketscommon/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;
}
