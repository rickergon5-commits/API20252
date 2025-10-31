import { conmysql } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const loginUsuario = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;

  try {
    // Buscar usuario en la BD
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_usuario = ?",
      [usr_usuario]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const user = rows[0];

    // Comparar contraseñas
    const passwordValida = await bcrypt.compare(usr_clave, user.usr_clave);
    if (!passwordValida)
      return res.status(401).json({ message: "Clave incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user.usr_id,
        usuario: user.usr_usuario,
        nombre: user.usr_nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar respuesta con token y datos de usuario
    res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.usr_id,
        usuario: user.usr_usuario,
        nombre: user.usr_nombre,
        correo: user.usr_correo, // si tienes campo correo
        rol: user.usr_rol, // opcional, si tienes roles
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
