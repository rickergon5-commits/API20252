import { conmysql } from "../db.js" //Esta línea importa una conexión a la base de datos MySQL desde otro archivo llamado db.js.
import fs from 'fs/promises'; //  Importar fs/promises para operaciones de archivos
import path from 'path';     //
import { fileURLToPath } from 'url'; // 👈 ¡ESTA FALTABA!

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
export const prueba=(req,res)=>{
    res.send(' prueba con exito');
}


export const getProductos=async(req,res)=>{
try {
    const [result]= await conmysql.query(' select * from productos')
    res.json({
        cant:result.length,
        data:result
    })
   //res.json(result)
} catch (error) {
    return res.status(500).json({message:" error en el servidor"})
}
}
// === BUSCAR PRODUCTO POR ID ===
export const getProductosxId = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [req.params.id]);
        if (result.length <= 0) return res.json({
            cant: 0,
            message: "Producto no encontrado"
        })
        res.json({
            cant: result.length,
            data: result[0]
        })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === INSERTAR UN PRODUCTO (POST) ===
export const postProducto = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
            // console.log(req.body) //para ver si llego al body
                        const prod_imagen =req.file? `/uploads/${req.file.filename}` :null; 
       const [result] = await conmysql.query(
            'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?,?,?,?,?,?)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );
        res.send({ prod_id: result.insertId });
    } catch (error) {
                console.error(' Error en postProducto:', error); //  muestra el error real
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === MODIFICAR PRODUCTO COMPLETO (PUT) ===
// === MODIFICAR PRODUCTO COMPLETO (PUT) ===
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
        
        let nueva_imagen = null;
        let imagen_antigua_path = null;

        // 1. Obtener la imagen actual del producto en la base de datos
        const [rows] = await conmysql.query(
            'SELECT prod_imagen FROM productos WHERE prod_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        const producto_actual = rows[0];
        const imagen_anterior = producto_actual.prod_imagen;

        // 2. Determinar la nueva imagen a guardar
        if (req.file) {
            // Se subió una nueva imagen
            nueva_imagen = `/uploads/${req.file.filename}`;
            // Si había una imagen anterior, la marcamos para ser eliminada
            if (imagen_anterior) {
                // Genera la ruta absoluta del archivo antiguo
                imagen_antigua_path = path.join(UPLOADS_DIR, path.basename(imagen_anterior));
            }
        } else {
            // No se subió una nueva imagen, mantenemos la anterior
            nueva_imagen = imagen_anterior;
        }

        // 3. Actualizar la base de datos
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, nueva_imagen, id]
        );

        if (result.affectedRows <= 0) {
            // Esto no debería pasar si rows.length > 0, pero es buena práctica
            return res.status(404).json({ message: "Producto no encontrado después de la consulta" });
        }

        // 4. Eliminar la imagen antigua del disco si existe una nueva
        if (imagen_antigua_path) {
            try {
                // Verificar si el archivo existe antes de intentar eliminar
                await fs.access(imagen_antigua_path);
                // Si existe, lo eliminamos
                await fs.unlink(imagen_antigua_path);
                // console.log(`Imagen antigua eliminada: ${imagen_antigua_path}`);
            } catch (error) {
                // console.warn(`Advertencia: No se pudo eliminar la imagen antigua ${imagen_antigua_path}. Error: ${error.message}`);
                // No detenemos el flujo de la app por un error de eliminación de archivo
            }
        }

        // 5. Devolver el producto actualizado
        const [fila] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
        res.json(fila[0]);

    } catch (error) {
       console.error(' Error en putProducto:', error); // Muestra el error real
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === ELIMINAR PRODUCTO (DELETE) ===
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id = ?', [id]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: "Producto no encontrado"
        });
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}