import express from 'express'
//importar las rutas OJO
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js'; 
import usuarioRoutes from './routes/usuarios.routes.js'; 
import authRoutes from "./routes/auth.routes.js";

const app=express();
// Para leer JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // para formularios

// Para leer form-data o x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));
//indicar las rutas a utilizar OJO
app.use("/api", authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes); 
app.use("/api", usuarioRoutes);


app.use((req,resp,next)=>{
    resp.status(400).json({
      message:'Endpoint not fount'
    })
})

export default app; 
