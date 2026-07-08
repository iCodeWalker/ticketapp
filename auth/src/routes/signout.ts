import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  /** we will send a header that will tell the user browser to dump all the information inside the cookie  */
  req.session = { jwt: null };
  res.send({});
});

export { router as signOutRouter };
