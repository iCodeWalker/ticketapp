import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@vkticketscommon/common";
import { Order } from "../../models/order";

it("Marks an order as cancelled", async () => {
  /** Create a ticket */
  const ticket = Ticket.build({
    title: "Title",
    price: 10,
  });
  await ticket.save();

  const user = global.getAuthCookie();
  /** Create an order for the ticket */

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket._id,
    })
    .expect(201);

  /** Make a request to cancel the order */
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  /** expectation to make sure the order has been cancelled */
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("Emits an order cancelled event");
