import { Router } from "express"
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from '../middlewares/upload.js';  // Ajusta la ruta según tu estructura de carpetas

//importar las funciones
import { prueba, getProductos,getProductosxId,postProducto,putProducto,deleteProducto } from "../controladores/productosCtrl.js";
const router = Router();
// === RUTAS ===
//router.get('/productos', prueba);
router.get("/productos", verifyToken, getProductos);
router.get("/productos/:id", verifyToken, getProductosxId);
//router.post("/productos", verifyToken, postProducto);
router.post("/productos", verifyToken, upload.single("imagen"), postProducto);
router.put('/productos/:id', verifyToken, upload.single('imagen'), putProducto);
//router.put("/productos/:id", verifyToken, putProducto);
router.delete("/productos/:id", verifyToken, deleteProducto);
export default router;
