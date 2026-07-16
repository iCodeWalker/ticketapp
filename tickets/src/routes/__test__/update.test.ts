import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns a 404 if the ticket id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "test",
      price: 10,
    })
    .expect(404);
});

it("Returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "test",
      price: 10,
    })
    .expect(401);
});

it("Returns a 401 if the user does not own/created the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "test 2",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "new test",
      price: 30,
    })
    .expect(401);
});

it("Returns a 400 if the user provides invalid title or price", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test 2",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set("Cookie", cookie)
    .send({
      title: "TEST",
      price: -10,
    })
    .expect(400);
});

it("Updates the ticket if the user provides valid input", async () => {
  const cookie = global.getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test 2",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 200,
    })
    .expect(200);

  const ticketReposnse = await request(app)
    .get(`/api/tickets/${response.body._id}`)
    .send();

  expect(ticketReposnse.body.title).toEqual("new title");
  expect(ticketReposnse.body.price).toEqual(200);
});
