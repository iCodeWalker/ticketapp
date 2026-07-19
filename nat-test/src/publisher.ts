import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

/** client is used to connect to the nats-streaming server */
const client = nats.connect("ticketapp", "test", {
  url: "http://localhost:4222",
});

/** After client successfully connect to the nats-streaming server it is going to emit a connect event */
client.on("connect", async () => {
  /** This function will be emitted when the client is connected to the nats server */
  console.log("Publisher connected to the nats");

  // const data = JSON.stringify({
  //   id: "1233",
  //   title: "Concert",
  //   price: 20,
  // });

  // client.publish("ticket:created", data, () => {
  //   /** This function is invoked after we have published the data */
  //   console.log("Event published");
  // });

  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: "123",
      title: "test",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
});
