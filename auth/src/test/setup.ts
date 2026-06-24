import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

/** This file contains some hooks that facilitates writing our test much easier */

let mongo: any;
/** Function runs before all our tests start's executing */
beforeAll(async () => {
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
