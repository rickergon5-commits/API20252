import { Router } from "express";
<<<<<<< HEAD
import { login } from "../controladores/authCtrl.js";

const router = Router();

router.post("/login", login);
=======
import { loginUsuario } from "../controladores/authCtrl.js";

const router = Router();

router.post("/login", loginUsuario);
>>>>>>> 9a93302 (Descripción de los cambios realizados)

export default router;
