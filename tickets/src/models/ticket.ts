import mongoose from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attributes: TicketAttributes): TicketDocument;
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
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: "version",
    optimisticConcurrency: true,
  },
);

/** To handle
 * Increments the version number on multiple saves
 */
// ticketSchema.pre("save", function () {
//   if (this.isNew) {
//     return;
//   }

//   this.set("version", this.get("version") + 1);
// });

/** Setting versioning key to version and not to __v that is y default */
// ticketSchema.set("versionKey", "version");
/** Adding versioning plugin (For concurrency issue) */
// ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema,
);

export { Ticket };
