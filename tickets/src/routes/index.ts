import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@vkticketscommon/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  /** To only send back the available tickets */
  const tickets = await Ticket.find({
    orderId: { $exists: false },
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
