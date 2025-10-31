import { Router } from "express"
//importar las funciones
import { verifyToken } from "../middlewares/verifyToken.js";

import { prueba, getClientes,getClientesxId,postCliente,putCliente,deleteCliente } from "../controladores/clientesCtrl.js"
const router=Router();
//armar nuestras rutas
//router.get('/clientes',prueba) //prueba de la api esta funcionando 
router.get("/clientes", verifyToken, getClientes);
router.get("/clientes/:id", verifyToken, getClientesxId);
router.post("/clientes", verifyToken, postCliente);
router.put("/clientes/:id", verifyToken, putCliente);
router.delete("/clientes/:id", verifyToken, deleteCliente);

export default router
