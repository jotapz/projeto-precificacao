import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
  .post("/usuarios", UserController.cadastrarUsuario)     
  .post("/login", UserController.login)                   
  .get("/usuarios", UserController.listarUsuarios)         
  .get("/usuarios/:id", UserController.buscarUsuarioPorId) 
  .put("/usuarios/:id", UserController.atualizarUsuario)   
  .delete("/usuarios/:id", UserController.deletarUsuario); 

export default router;