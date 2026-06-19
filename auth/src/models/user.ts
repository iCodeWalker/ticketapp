import mongoose from "mongoose";

/** An interface that describe the properties that are required to create a new user */
interface UserAttributes {
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

/** Now we can feed this schema into mongoose and mongoose is going to create a model from it */
/** Model : is how we actually access our whole set of data inside of our mongodb database */

const User = mongoose.model("User", userSchema);

/** If we want to create a new user instance, we can will use this function instead of conventional new User() */
const buildUser = (attributes: UserAttributes) => {
  return new User(attributes);
};

export { User, buildUser };
