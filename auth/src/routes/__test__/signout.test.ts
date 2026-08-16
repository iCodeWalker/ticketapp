import request from "supertest";
import { app } from "../../app";

it("Clears the cookie after signout", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const signupCookie = signupResponse.get("Set-Cookie");

  const signoutResponse = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  const signoutCookie = signoutResponse.get("Set-Cookie");

  expect(signoutCookie).toBeDefined();
  expect(signupCookie).toBeDefined();

  expect(signoutCookie![0]).not.toEqual(signupCookie![0]);
});
