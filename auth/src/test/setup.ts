import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../app";

/** To tell typescript that a global property named signUp is present */

declare global {
  var getAuthCookie: () => Promise<string[]>;
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
global.getAuthCookie = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Failed to get cookie from response");
  }

  return cookie;
};

/** Fucntion for making auth requests : End :*/
