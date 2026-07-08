import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// import { RequestValidationError } from "../errors/request-validation-error";
// import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
// import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import { validateRequest, BadRequestError } from "@vkticketscommon/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new RequestValidationError(errors.array());
    // }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    /** Generate the JWT after password and email is matched and set it on the req object */
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    req.session = { jwt: userJwt };

    let userResponse = {
      id: existingUser._id,
      email: existingUser.email,
    };

    res.status(200).send(userResponse);
  },
);

export { router as signInRouter };
