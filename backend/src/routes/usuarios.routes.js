const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middlewares/auth");

console.log(" usuarios.routes.js cargado");
//esto no se si se pone aqui , VERIFICARLOOOOO
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LISTAR usuarios
router.get("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, rol, email, nombre_publico, avatar_url
        FROM usuarios
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// OBTENER usuario por id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, rol, email, nombre_publico, avatar_url
FROM usuarios
WHERE id = ?
LIMIT 1`,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// REGISTRO
router.post("/register", async (req, res) => {
  const { rol, email, contrasena, nombrePublico } = req.body;

  if (!rol || !email || !contrasena || !nombrePublico) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const hash = await bcrypt.hash(contrasena, 10);

    const result = await conn.query(
      `INSERT INTO usuarios (rol, email, contrasena, nombre_publico)
   VALUES (?, ?, ?, ?)`,
      [rol, email, hash, nombrePublico]
    );

    res.status(201).json({
      id: Number(result.insertId),
      rol,
      email,
      nombrePublico
    });
  } catch (e) {
    console.error("ERROR REGISTER:", e);

    if (String(e).includes("Duplicate")) {
      return res.status(409).json({ error: "El email ya existe" });
    }

    return res.status(500).json({
      error: "Error del servidor",
      detalle: String(e)
    });
  } finally {
    conn.release();
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, rol, email, contrasena, nombre_publico, avatar_url
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const usuario = rows[0];
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const ok = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      id: usuario.id,
      rol: usuario.rol,
      email: usuario.email,
      nombrePublico: usuario.nombre_publico,
      avatarUrl: usuario.avatar_url
    });
  } catch (e) {
    console.error("ERROR LOGIN:", e);
    res.status(500).json({ error: "Error del servidor", detalle: String(e) });
  } finally {
    conn.release();
  }
});

// ACTUALIZAR usuario
router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const { rol, email, contrasena, nombrePublico } = req.body;

  if (!rol || !email || !nombrePublico) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    let result;

    if (contrasena) {
      result = await conn.query(
        `UPDATE usuarios
         SET rol = ?, email = ?, contrasena = ?, nombre_publico = ?
         WHERE id = ?`,
        [rol, email, contrasena, nombrePublico, id]
      );
    } else {
      result = await conn.query(
        `UPDATE usuarios
         SET rol = ?, email = ?, nombre_publico = ?
         WHERE id = ?`,
        [rol, email, nombrePublico, id]
      );
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({ id, rol, email, nombrePublico });
  } catch (e) {
    if (String(e).includes("Duplicate")) {
      return res.status(409).json({ error: "El email ya existe" });
    }
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// BORRAR usuario
router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `DELETE FROM usuarios WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({ ok: true, id });
  } finally {
    conn.release();
  }
});

module.exports = router;
