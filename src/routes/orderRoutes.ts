import express, { Request, Response } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

const router = express.Router();

// Criar pedido
router.post("/", async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);

    // Atualiza a lista de pedidos em cada produto
    for (const item of order.produtos) {
      await Product.findByIdAndUpdate(item.produto, {
        $addToSet: { pedidos: order._id },
      });
    }

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Listar pedidos (com produtos populados)
router.get("/", async (_req: Request, res: Response) => {
  const orders = await Order.find().populate("produtos.produto", "nome preco");
  res.json(orders);
});

// Atualizar pedido por ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cliente, produtos } = req.body;

    // Buscar pedido atual
    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Remover o ID do pedido dos produtos antigos
    for (const item of oldOrder.produtos) {
      await Product.findByIdAndUpdate(item.produto, {
        $pull: { pedidos: oldOrder._id },
      });
    }

    //Atualizar o pedido
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { cliente, produtos },
      { new: true, runValidators: true }
    ).populate("produtos.produto", "nome preco");

    // Adicionar o ID do pedido nos novos produtos
    for (const item of produtos) {
      await Product.findByIdAndUpdate(item.produto, {
        $addToSet: { pedidos: id },
      });
    }

    res.json(updatedOrder);
  } catch (err: any) {
    console.error("Erro ao atualizar pedido:", err);
    res.status(400).json({ error: err.message });
  }
});

// Deletar pedido por ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar o pedido antes de deletar
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    // Remover a referência do pedido em cada produto
    for (const item of order.produtos) {
      await Product.findByIdAndUpdate(item.produto, {
        $pull: { pedidos: order._id },
      });
    }

    //  Deletar o pedido
    await Order.findByIdAndDelete(id);

    res.json({ message: "Pedido deletado com sucesso!" });
  } catch (err: any) {
    console.error("Erro ao deletar pedido:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
