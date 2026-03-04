const express = require("express");
const router = express.Router();
const pool = require("../db");

// LISTAR contactos por usuario
router.get("/user/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) return res.status(400).json({ error: "ID inválido" });

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT id, user_id, nombre, telefono, created_at FROM contactos_confianza WHERE user_id=? ORDER BY id DESC",
      [userId]
    );
    res.json(rows.map(r => ({ ...r, id: Number(r.id), user_id: Number(r.user_id) })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// CREAR contacto
router.post("/", async (req, res) => {
  const { user_id, nombre, telefono } = req.body;

  if (user_id === undefined || !nombre || !telefono) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO contactos_confianza (user_id, nombre, telefono) VALUES (?, ?, ?)",
      [user_id, nombre, telefono]
    );

    res.status(201).json({
      id: Number(result.insertId),
      user_id: Number(user_id),
      nombre,
      telefono
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

// BORRAR contacto
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

  const conn = await pool.getConnection();
  try {
    const result = await conn.query("DELETE FROM contactos_confianza WHERE id=?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "No encontrado" });

    res.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error del servidor" });
  } finally {
    conn.release();
  }
});

module.exports = router;