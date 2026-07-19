import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    /** Return a promise */
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        /** This callback gets envoked after nats library has actually published this event */
        console.log("Event Publish");

        if (err) {
          return reject(err);
        }

        console.log("Event published to channel/subject:", this.subject);
        return resolve();
      });
    });
  }
}
