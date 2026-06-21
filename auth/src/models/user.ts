import mongoose from "mongoose";
import { Password } from "../services/password";

/** An interface that describe the properties that are required to create a new user */
interface UserAttributes {
  email: string;
  password: string;
}

/** An interface that describe the properties that a User model has */
interface UserModel extends mongoose.Model<UserDocument> {
  crete(attributes: UserAttributes): UserDocument;
}

/** An interface that describes the properties that a User document has. This is done to avoid errors for the extra properties that the user model have */
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

/** Schema : using which we will tell mongoose about all the different properties that a user is going to have */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await Password.toHash(this.password);
  }
});

/** Added a custom function to the User Model  */
userSchema.statics.create = (attributes: UserAttributes) => {
  return new User(attributes);
};

/** Now we can feed this schema into mongoose and mongoose is going to create a model from it */
/** Model : is how we actually access our whole set of data inside of our mongodb database */

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

/** If we want to create a new user instance, we can will use this function instead of conventional new User() */
// const buildUser = (attributes: UserAttributes) => {
//   return new User(attributes);
// };

// User.create({});

// const user = User.create({ email: "dad@adad.com", password: "adadad" });

export { User };
// export { User, buildUser };
