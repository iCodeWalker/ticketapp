import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const client = nats.connect("ticketapp", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("order-service");

  const subscription = client.subscribe(
    "ticket:created", // name of the channel
    "order-service-queue-group", // name of the queue group
    options,
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data == "string") {
      console.log(`Received event #${msg.getSequence()},  with data ${data}`);
    }

    msg.ack();
  });
});

/** Intercepting Singnal that are sent to the process any time we happen to close using ctrl+c or restart the process */
process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
