import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
