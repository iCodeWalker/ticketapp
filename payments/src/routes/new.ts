import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@vkticketscommon/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    /** Find an order  */
    const order = await Order.findById(orderId);

    /** If no order found */
    if (!order) {
      throw new NotFoundError();
    }
    /** Checkong if the order user making the payment for is his or not */
    if (order!.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    /** Checking if order is cancelled */
    if (order!.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    res.send({ success: true });
  },
);

export { router as createChargeRouter };
