import request from "supertest";
import { app } from "../../app";

it("Can fetch a list of all tickets", async () => {
  /** Create tickets first */
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "test 1",
      price: 10,
    });

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "test 2",
      price: 20,
    });

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(2);
});
