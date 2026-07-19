import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const client = nats.connect("ticketapp", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");
  new TicketCreatedListener(client).listen();

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // const options = client
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName("order-service");

  // const subscription = client.subscribe(
  //   "ticket:created", // name of the channel
  //   "order-service-queue-group", // name of the queue group
  //   options,
  // );

  // subscription.on("message", (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data == "string") {
  //     console.log(`Received event #${msg.getSequence()},  with data ${data}`);
  //   }

  //   msg.ack();
  // });
});

/** Intercepting Singnal that are sent to the process any time we happen to close using ctrl+c or restart the process */
process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());

// abstract class Listener {
//   abstract subject: string;
//   abstract queueGroupName: string;
//   abstract onMessage(data: any, msg: Message): void;
//   private client: Stan;
//   protected ackWait = 5 * 1000;

//   constructor(client: Stan) {
//     this.client = client;
//   }

//   subcriptionOptions() {
//     return this.client
//       .subscriptionOptions()
//       .setDeliverAllAvailable()
//       .setManualAckMode(true)
//       .setAckWait(this.ackWait)
//       .setDurableName(this.queueGroupName);
//   }

//   listen() {
//     const subscription = this.client.subscribe(
//       this.subject,
//       this.queueGroupName,
//       this.subcriptionOptions(),
//     );

//     subscription.on("message", (msg: Message) => {
//       console.log(`Message received: ${this.subject}/${this.queueGroupName}`);

//       const parsedData = this.parseMessage(msg);

//       this.onMessage(parsedData, msg);
//     });
//   }

//   parseMessage(msg: Message) {
//     const data = msg.getData();

//     return typeof data === "string"
//       ? JSON.parse(data)
//       : JSON.parse(data.toString("utf8"));
//   }
// }

// class TicketCreatedListener extends Listener {
//   subject = "ticket:created";
//   queueGroupName = "payments-service";
//   onMessage(data: any, msg: Message) {
//     console.log("EVent data:", data);

//     msg.ack();
//   }
// }
