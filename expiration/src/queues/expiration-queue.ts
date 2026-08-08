import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

/** interface for the job object */
interface Payload {
  orderId: string;
}

/** order:expiration : name of the bucket in which the job is stored inside the redis */
const expirationQueue = new Queue<Payload>("order:expiration", {
  /** Options to connect to the redis server */
  redis: {
    host: process.env.REDIS_HOST,
  },
});

/** We will create a job anytime we recieve an order-created event */

/** Process back the job object */
expirationQueue.process(async (job) => {
  console.log("Publish an expiration completed event", job.data);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
