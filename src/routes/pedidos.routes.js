import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

// Importar las funciones del controlador
import { 
    getPedidos, 
    getPedidoxId, 
    postPedido, 
    putPedido, 
    deletePedido 
} from "../controladores/pedidosCtrl.js";

const router = Router();

// === RUTAS ===
router.get("/pedidos", verifyToken, getPedidos);
router.get("/pedidos/:id", verifyToken, getPedidoxId);
router.post("/pedidos", verifyToken, postPedido);
router.put("/pedidos/:id", verifyToken, putPedido);
router.delete("/pedidos/:id", verifyToken, deletePedido);

export default router;