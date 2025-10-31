import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // El formato correcto es: Bearer token
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(403).json({ message: "Token no proporcionado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Token inválido o expirado" });

    req.user = decoded; // guarda los datos del usuario para usarlos luego
    next();
  });
};
