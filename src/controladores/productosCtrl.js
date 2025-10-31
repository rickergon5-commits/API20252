import { conmysql } from "../db.js" //Esta línea importa una conexión a la base de datos MySQL desde otro archivo llamado db.js.

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
export const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    let prod_imagen;

    // Si llega imagen, la actualiza
    if (req.file) {
      prod_imagen = `/uploads/${req.file.filename}`;
    } else {
      // Si NO llega imagen, recuperar la anterior
      const [row] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);
      prod_imagen = row.length > 0 ? row[0].prod_imagen : null;
    }

    const [result] = await conmysql.query(
      'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });

    const [fila] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
    res.json(fila[0]);
  } catch (error) {
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