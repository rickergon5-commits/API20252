import { conmysql } from "../db.js";

// === OBTENER TODOS LOS PEDIDOS CON INFO COMPLETA ===
export const getPedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            SELECT 
                p.ped_id,
                p.ped_fecha,
                p.ped_estado,
                c.cli_id,
                c.cli_nombre,
                c.cli_correo,
                u.usr_id,
                u.usr_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.cli_id = c.cli_id
            LEFT JOIN usuarios u ON p.usr_id = u.usr_id
            ORDER BY p.ped_fecha DESC
        `);
        res.json({
            cant: result.length,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === BUSCAR PEDIDO POR ID CON DETALLES ===
export const getPedidoxId = async (req, res) => {
    try {
        const [pedido] = await conmysql.query(`
            SELECT 
                p.ped_id,
                p.ped_fecha,
                p.ped_estado,
                c.cli_id,
                c.cli_nombre,
                c.cli_correo,
                c.cli_telefono,
                c.cli_direccion,
                u.usr_id,
                u.usr_nombre
            FROM pedidos p
            LEFT JOIN clientes c ON p.cli_id = c.cli_id
            LEFT JOIN usuarios u ON p.usr_id = u.usr_id
            WHERE p.ped_id = ?
        `, [req.params.id]);

        if (pedido.length <= 0) return res.json({
            cant: 0,
            message: "Pedido no encontrado"
        });

        // Obtener detalles del pedido
        const [detalles] = await conmysql.query(`
            SELECT 
                pd.det_id,
                pd.det_cantidad,
                pd.det_precio,
                pr.prod_id,
                pr.prod_codigo,
                pr.prod_nombre,
                pr.prod_imagen
            FROM pedidos_detalle pd
            LEFT JOIN productos pr ON pd.prod_id = pr.prod_id
            WHERE pd.ped_id = ?
        `, [req.params.id]);

        res.json({
            cant: 1,
            data: {
                ...pedido[0],
                detalles: detalles
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === INSERTAR PEDIDO CON DETALLES (POST) ===
export const postPedido = async (req, res) => {
    const connection = await conmysql.getConnection();
    try {
        await connection.beginTransaction();

        const { cli_id, usr_id, ped_estado, detalles } = req.body;
        
        // Insertar el pedido
        const [resultPedido] = await connection.query(
            'INSERT INTO pedidos (cli_id, ped_fecha, usr_id, ped_estado) VALUES (?, NOW(), ?, ?)',
            [cli_id, usr_id, ped_estado || 0]
        );

        const ped_id = resultPedido.insertId;

        // Insertar los detalles del pedido
        if (detalles && detalles.length > 0) {
            for (const detalle of detalles) {
                await connection.query(
                    'INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
                    [detalle.prod_id, ped_id, detalle.det_cantidad, detalle.det_precio]
                );
            }
        }

        await connection.commit();
        res.send({ ped_id: ped_id, message: "Pedido creado exitosamente" });
    } catch (error) {
        await connection.rollback();
        console.error('Error en postPedido:', error);
        return res.status(500).json({ message: "Error en el servidor" });
    } finally {
        connection.release();
    }
}

// === MODIFICAR ESTADO DE PEDIDO (PUT) ===
export const putPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { ped_estado } = req.body;
        
        const [result] = await conmysql.query(
            'UPDATE pedidos SET ped_estado=? WHERE ped_id=?',
            [ped_estado, id]
        );

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const [fila] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id=?', [id]);
        res.json(fila[0]);
    } catch (error) {
        console.error('Error en putPedido:', error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// === ELIMINAR PEDIDO (DELETE) ===
export const deletePedido = async (req, res) => {
    const connection = await conmysql.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        
        // Primero eliminar los detalles
        await connection.query('DELETE FROM pedidos_detalle WHERE ped_id = ?', [id]);
        
        // Luego eliminar el pedido
        const [result] = await connection.query('DELETE FROM pedidos WHERE ped_id = ?', [id]);

        if (result.affectedRows <= 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        await connection.commit();
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        await connection.rollback();
        console.error('Error en deletePedido:', error);
        return res.status(500).json({ message: "Error en el servidor" });
    } finally {
        connection.release();
    }
}