import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getUsuarios,
  getUsuarioxId,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../controladores/usuariosCtrl.js";
import { loginUsuario } from "../controladores/authCtrl.js"; // 👈 Importa el login aquí

const router = Router();

// === RUTAS ===
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioxId);
router.post("/usuarios", postUsuario);
router.put("/usuarios/:id", putUsuario);
router.delete("/usuarios/:id", deleteUsuario);

// === LOGIN ===
router.post("/usuario/login", loginUsuario); // 

export default router;
