import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns a 404 if the ticket does not exist", async () => {
  /** Create a random object id */
  let id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("Returns the ticket if the ticket exists", async () => {
  const title = "test";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price,
    });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body._id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
