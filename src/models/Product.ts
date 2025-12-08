import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  nome: string;
  preco: number;
  pedidos?: mongoose.Types.ObjectId[];
}

const ProductSchema = new Schema<IProduct>({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  pedidos: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
