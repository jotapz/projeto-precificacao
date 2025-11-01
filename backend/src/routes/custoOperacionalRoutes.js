import express from "express";
import CustoOperacionalController from "../controllers/custoOperacionalController.js";

const router = express.Router();

router
  .get("/custos/user/:userId", CustoOperacionalController.listarCustosPorUsuario)
  .post("/custos", CustoOperacionalController.cadastrarCusto)
  .put("/custos/:id", CustoOperacionalController.atualizarCusto)
  .delete("/custos/:id", CustoOperacionalController.deletarCusto);

export default router;