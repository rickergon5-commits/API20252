import express from 'express';
import cors from 'cors';  // 👈 Importa cors
//importar las rutas
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import usuarioRoutes from './routes/usuarios.routes.js'; 
import authRoutes from "./routes/auth.routes.js";

const app = express();

// === CORS ===
app.use(cors({
  origin: "http://localhost:8100",      // tu frontend Ionic
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === RUTAS ===
app.use("/api", authRoutes);
app.use("/api", clientesRoutes);
app.use("/api", productosRoutes); 
app.use("/api", usuarioRoutes);

// Manejo de endpoints no encontrados
app.use((req, resp, next) => {
    resp.status(404).json({
      message:'Endpoint not found'
    });
});

export default app;
