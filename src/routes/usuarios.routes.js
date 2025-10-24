import { Router } from "express";
// importar las funciones
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  prueba,
  getUsuarios,
  getUsuarioxId,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../controladores/usuariosCtrl.js";

const router = Router();

// === RUTAS ===
//router.get('/usuarios', prueba);
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioxId);
router.post("/usuarios", postUsuario);
router.put("/usuarios/:id", putUsuario);
router.delete("/usuarios/:id", deleteUsuario);

export default router;
