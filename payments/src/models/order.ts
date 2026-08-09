import { OrderStatus } from "@vkticketscommon/common";
import mongoose from "mongoose";

export const toJSON = {
  transform(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

export interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

export interface OrderDocument extends mongoose.Document {
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

export interface OrderModel extends mongoose.Model<OrderDocument> {
  build(order: OrderAttrs): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON,
    versionKey: "version",
    optimisticConcurrency: true,
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    userId: attrs.userId,
    price: attrs.price,
    version: attrs.version,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };
