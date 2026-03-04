const express = require("express");
const router = express.Router();
const pool = require("../db");

// LISTAR comentarios de un post
router.get("/post/:postId", async (req, res) => {
  const postId = Number(req.params.postId);
  if (!Number.isFinite(postId)) return res.status(400).json({ message: "ID inválido" });

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT c.id, c.post_id, c.user_id, c.contenido, c.created_at,
              u.nombre_publico, u.avatar_url
       FROM comments c
       JOIN usuarios u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );

    // evitar BigInt si apareciera
    const safe = rows.map(r => ({
      ...r,
      id: Number(r.id),
      post_id: Number(r.post_id),
      user_id: Number(r.user_id),
    }));

    res.json(safe);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error obteniendo comentarios" });
  } finally {
    conn.release();
  }
});

// CREAR comentario
router.post("/", async (req, res) => {
  const { post_id, user_id, contenido } = req.body;

  if (post_id === undefined || user_id === undefined || !contenido) {
    return res.status(400).json({ message: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO comments (post_id, user_id, contenido) VALUES (?, ?, ?)",
      [post_id, user_id, contenido]
    );

    res.status(201).json({
      id: Number(result.insertId),
      post_id: Number(post_id),
      user_id: Number(user_id),
      contenido,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error creando comentario" });
  } finally {
    conn.release();
  }
});

module.exports = router;