import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../app";
import jwt from "jsonwebtoken";

/** To tell typescript that a global property named getAuthCookie is present */

declare global {
  //   var getAuthCookie: () => Promise<string[]>;
  var getAuthCookie: () => string[];
}

/** This file contains some hooks that facilitates writing our test much easier */

let mongo: any;
/** Function runs before all our tests start's executing */
beforeAll(async () => {
  /** Setting environment variable for jwt */
  process.env.JWT_KEY = "qwerty";
  mongo = await MongoMemoryServer.create();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

/** Function runs before each of our test */
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db?.collections();

    for (let collection of collections) {
      /** This will delte  */
      await collection.deleteMany({});
    }
  }
});

/** Hook that runs after all our tests are complete */
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

/** Fucntion for making auth requests : Start :*/
// global.getAuthCookie = async () => {
global.getAuthCookie = () => {
  //   const email = "test@test.com";
  //   const password = "password";

  //   const response = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email,
  //       password,
  //     })
  //     .expect(201);

  //   const cookie = response.get("Set-Cookie");

  //   if (!cookie) {
  //     throw new Error("Failed to get cookie from response");
  //   }

  //   return cookie;

  // Build a json web token payload. (id and email)
  let paylod = {
    id: "kadwebcc",
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(paylod, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

/** Fucntion for making auth requests : End :*/
