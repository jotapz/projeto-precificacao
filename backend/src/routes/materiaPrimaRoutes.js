import express from "express";
import MateriaPrimaController from "../controllers/materiaPrimaController.js";

const router = express.Router();

router
  .get("/materiasprimas/user/:userId", MateriaPrimaController.listarMateriasPrimasPorUsuario)
  .post("/materiasprimas", MateriaPrimaController.cadastrarMateriaPrima)
  .put("/materiasprimas/:id", MateriaPrimaController.atualizarMateriaPrima)
  .delete("/materiasprimas/:id", MateriaPrimaController.deletarMateriaPrima);

export default router;