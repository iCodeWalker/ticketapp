import { Listener, OrderCreatedEvent, Subjects } from "@vkticketscommon/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    /** waiting delay time before expiration is processed */
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    /** We will create a job anytime we recieve an order-created event */
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        /** In MilliSeconds, the extra delay that is added in before we receive the job back from redis
         * to be processed by the process statement of the bull
         */
        delay: delay,
      },
    );

    msg.ack();
  }
}
