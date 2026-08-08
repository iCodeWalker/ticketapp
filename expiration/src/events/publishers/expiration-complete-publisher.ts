import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@vkticketscommon/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: ExpirationCompleteEvent["subject"] = Subjects.ExpirationComplete;
}
