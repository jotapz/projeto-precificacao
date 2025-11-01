import express from "express";
import DespesaController from "../controllers/despesaController.js";

const router = express.Router();

router
  .get("/despesas/user/:userId", DespesaController.listarDespesasPorUsuario)
  .post("/despesas", DespesaController.cadastrarDespesa)
  .put("/despesas/:id", DespesaController.atualizarDespesa)
  .delete("/despesas/:id", DespesaController.deletarDespesa);

export default router;