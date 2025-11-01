import express from "express";
import ProdutoController from "../controllers/produtoController.js";

const router = express.Router();

router
  .get("/produtos/user/:userId", ProdutoController.listarProdutosPorUsuario)
  .post("/produtos", ProdutoController.cadastrarProduto)
  .put("/produtos/:id", ProdutoController.atualizarProduto) // Rota de Atualizar
  .delete("/produtos/:id", ProdutoController.deletarProduto)
  .get("/produtos/:id/preco-final", ProdutoController.calcularPrecoFinal); // Rota do Cálculo

export default router;