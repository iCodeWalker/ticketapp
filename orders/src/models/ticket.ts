import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

export const toJSON = {
  transform(doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON,
    versionKey: "version",
    optimisticConcurrency: true,
  },
);

/** statics add a new method directly on the model */
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

/** methods add a new method to the document */
ticketSchema.methods.isReserved = async function () {
  /** this === the ticket document on which we just called 'isReserved' method  */
  /**
   * Run query to look for all orders
   * Find an order where the ticket is the ticket wwe just found, and the status of the order is not cancelled
   * If we found some order than the ticket is already blocked by some other user
   */
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema,
);

export { Ticket };
