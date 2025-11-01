import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
  .get("/usuarios", UserController.listarUsuarios)       // GET /usuarios -> Lista todos
  .get("/usuarios/:id", UserController.buscarUsuarioPorId) // GET /usuarios/123 -> Busca um
  .post("/usuarios", UserController.cadastrarUsuario)      // POST /usuarios -> Cadastra um
  .put("/usuarios/:id", UserController.atualizarUsuario)   // PUT /usuarios/123 -> Atualiza um
  .delete("/usuarios/:id", UserController.deletarUsuario); // DELETE /usuarios/123 -> Deleta um

export default router;