import express from 'express';
import cors from 'cors';  // 👈 Importa cors
import path from 'path';                    //  IMPORTAR pat
import { fileURLToPath } from 'url';  //  AGREGAR ESTA LÍNEA
//importar las rutas
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import usuarioRoutes from './routes/usuarios.routes.js'; 
import pedidosRoutes from './routes/pedidos.routes.js'; // 
import authRoutes from "./routes/auth.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CORS ===  
const allowedOrigins = [
  'http://localhost:8100',
  'http://localhost',
  'capacitor://localhost',
  'ionic://localhost'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS denegado')); // solo permite orígenes de la lista
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// === RUTAS ===
app.use("/api", authRoutes);
app.use("/api", clientesRoutes);
app.use("/api", productosRoutes); 
app.use("/api", usuarioRoutes);
app.use("/api", pedidosRoutes); 
// Manejo de endpoints no encontrados
app.use((req, resp, next) => {
    resp.status(404).json({
      message:'Endpoint not found'
    });
});

export default app;
