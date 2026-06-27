import request from "supertest";
import { app } from "../../app";

it("Response with details of current user", async () => {
  //   const signUpResponse = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "test@test.com",
  //       password: "password",
  //     })
  //     .expect(201);

  //   const cookie = signUpResponse.get("Set-Cookie");

  const cookie = await global.getAuthCookie();

  if (!cookie) {
    throw new Error("Cookie not set after signup");
  }

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  console.log(response.body);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Response with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(401);

  expect(response.body.currentUser).toEqual(undefined);
});
