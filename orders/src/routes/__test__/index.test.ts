import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ticket 1",
    price: 10,
  });

  await ticket.save();
  return ticket;
};

it("Fetches orders of a particular user", async () => {
  /** Create 3 tickets */
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const userOne = global.getAuthCookie();
  const userTwo = global.getAuthCookie();
  /** Create 1 order as user #1 */

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticket1._id,
    })
    .expect(201);
  /** Create 2 orders as user #2 */
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticket2._id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticket3._id,
    })
    .expect(201);
  /** Make request to get orders of user #2 */
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  /** Make sure we only recieve the orders of user #2 */

  expect(response.body.length).toEqual(2);

  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticket2._id.toString());
  expect(response.body[1].ticket.id).toEqual(ticket3._id.toString());
});
