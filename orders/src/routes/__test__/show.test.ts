import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("Fetches the orders", async () => {
  /** Create a ticket */
  const ticket = Ticket.build({
    title: "Ticket 1",
    price: 10,
  });

  await ticket.save();

  const user = global.getAuthCookie();
  /** Make a request to create an order for that ticket */

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket._id,
    })
    .expect(201);

  /** Make request to fetch the order */

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Returns an error if some user tries to access orders of some other user", async () => {
  /** Create a ticket */
  const ticket = Ticket.build({
    title: "Ticket 1",
    price: 10,
  });

  await ticket.save();

  const user = global.getAuthCookie();
  /** Make a request to create an order for that ticket */

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket._id,
    })
    .expect(201);

  /** Make request to fetch the order */

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.getAuthCookie())
    .send()
    .expect(401);
});
