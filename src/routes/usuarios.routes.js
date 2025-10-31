import { Router } from "express";
<<<<<<< HEAD
// importar las funciones
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  prueba,
=======
import { verifyToken } from "../middlewares/verifyToken.js";
import {
>>>>>>> 9a93302 (Descripción de los cambios realizados)
  getUsuarios,
  getUsuarioxId,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../controladores/usuariosCtrl.js";
<<<<<<< HEAD
=======
import { loginUsuario } from "../controladores/authCtrl.js"; // 👈 Importa el login aquí
>>>>>>> 9a93302 (Descripción de los cambios realizados)

const router = Router();

// === RUTAS ===
<<<<<<< HEAD
//router.get('/usuarios', prueba);
=======
>>>>>>> 9a93302 (Descripción de los cambios realizados)
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioxId);
router.post("/usuarios", postUsuario);
router.put("/usuarios/:id", putUsuario);
router.delete("/usuarios/:id", deleteUsuario);

<<<<<<< HEAD
=======
// === LOGIN ===
router.post("/usuario/login", loginUsuario); // 

>>>>>>> 9a93302 (Descripción de los cambios realizados)
export default router;
