import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
  .post("/usuarios", UserController.cadastrarUsuario)      // Registro
  .post("/login", UserController.login)                    // Login
  .get("/usuarios", UserController.listarUsuarios)         // Lista todos
  .get("/usuarios/:id", UserController.buscarUsuarioPorId) // Busca um
  .put("/usuarios/:id", UserController.atualizarUsuario)   // PUT /usuarios/123 -> Atualiza um
  .delete("/usuarios/:id", UserController.deletarUsuario); // DELETE /usuarios/123 -> Deleta um

export default router;