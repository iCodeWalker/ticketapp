import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "../../models/order";

it("Retruns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticketId,
    })
    .expect(404);
});

it("Returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });

  await ticket.save();

  const order = Order.build({
    ticket: ticket,
    userId: "2121123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket._id,
    })
    .expect(400);
});

it("Reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.getAuthCookie())
    .send({
      ticketId: ticket._id,
    })
    .expect(201);
});

it.todo("emits an order created event");
