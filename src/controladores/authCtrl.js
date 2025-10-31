import { conmysql } from "../db.js";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import bcrypt from "bcryptjs"; // para encriptar y comparar claves
import dotenv from "dotenv";

dotenv.config(); // lee las variables del archivo .env

// === LOGIN ===
export const login = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;

  try {
=======
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const loginUsuario = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;

  try {
    // Buscar usuario en la BD
>>>>>>> 9a93302 (Descripción de los cambios realizados)
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usr_usuario = ?",
      [usr_usuario]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const user = rows[0];

<<<<<<< HEAD
    // compara la clave ingresada con la almacenada (hash)
=======
    // Comparar contraseñas
>>>>>>> 9a93302 (Descripción de los cambios realizados)
    const passwordValida = await bcrypt.compare(usr_clave, user.usr_clave);
    if (!passwordValida)
      return res.status(401).json({ message: "Clave incorrecta" });

<<<<<<< HEAD
    // crea el token
=======
    // Crear token JWT
>>>>>>> 9a93302 (Descripción de los cambios realizados)
    const token = jwt.sign(
      {
        id: user.usr_id,
        usuario: user.usr_usuario,
        nombre: user.usr_nombre,
      },
<<<<<<< HEAD
      process.env.JWT_SECRET, // clave secreta en tu .env
      { expiresIn: "1h" } // expira en 2 horas
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
=======
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
>>>>>>> 9a93302 (Descripción de los cambios realizados)
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
