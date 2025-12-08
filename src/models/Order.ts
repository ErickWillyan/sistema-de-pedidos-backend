import mongoose, { Schema, Document } from "mongoose";

export interface IOrderProduct {
  produto: mongoose.Types.ObjectId;
  quantidade: number;
}

export interface IOrder extends Document {
  cliente: string;
  data: Date;
  produtos: IOrderProduct[];
}

const OrderSchema = new Schema<IOrder>({
  cliente: { type: String, required: true },
  data: { type: Date, default: Date.now },
  produtos: [
    {
      produto: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantidade: { type: Number, required: true, min: 1 },
    },
  ],
});

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
