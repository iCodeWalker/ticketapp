import mongoose from "mongoose";
import { OrderStatus } from "@vkticketscommon/common";
import { TicketDocument } from "./ticket";

export { OrderStatus };

export const toJSON = {
  transform(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

/** Interface that describes properties to create a new order (Document) */
interface OrderAttr {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

/** Interface that describes all the properties that a saved order (Document) has */
interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

/** Interface that describes all the properties that a Model (Document) has */
interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttr): OrderDocument;
}

/** Order schema */

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON,
  },
);

/** Added a custom function to the Order Model  */
orderSchema.statics.build = (attrs: OrderAttr) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
