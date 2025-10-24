import { conmysql } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // para encriptar y comparar claves
import dotenv from "dotenv";

dotenv.config(); // lee las variables del archivo .env

// === LOGIN ===
export const login = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;

  try {
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_usuario = ?",
      [usr_usuario]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const user = rows[0];

    // compara la clave ingresada con la almacenada (hash)
    const passwordValida = await bcrypt.compare(usr_clave, user.usr_clave);
    if (!passwordValida)
      return res.status(401).json({ message: "Clave incorrecta" });

    // crea el token
    const token = jwt.sign(
      {
        id: user.usr_id,
        usuario: user.usr_usuario,
        nombre: user.usr_nombre,
      },
      process.env.JWT_SECRET, // clave secreta en tu .env
      { expiresIn: "1h" } // expira en 2 horas
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
