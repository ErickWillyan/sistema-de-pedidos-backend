import express, { Request, Response } from "express";
import { Product } from "../models/Product";

const router = express.Router();

// Criar produto
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Listar produtos
router.get("/", async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});

// Atualizar produto por ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar produto por ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteProduct = await Product.deleteOne({ _id: id });

    if (deleteProduct.deletedCount == 0) {
      return res
        .status(404)
        .json({ message: "Não foi possível deletar este produto" });
    }

    res.json(deleteProduct);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
