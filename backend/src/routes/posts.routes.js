const express = require("express");
const router = express.Router();
const pool = require("../db");

// Crear post
router.post("/", async (req, res) => {

    const { user_id, titulo, contenido } = req.body;

    if (!user_id || !titulo || !contenido) {
        return res.status(400).json({ message: "Faltan campos" });
    }

    const conn = await pool.getConnection();

    try {

        const result = await conn.query(
            "INSERT INTO posts (user_id, titulo, contenido) VALUES (?, ?, ?)",
            [user_id, titulo, contenido]
        );

        res.status(201).json({
            id: Number(result.insertId),
            titulo,
            contenido
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error creando post" });

    } finally {

        conn.release();

    }

});

// Listar posts
router.get("/", async (req, res) => {

    const conn = await pool.getConnection();

    try {

        const rows = await conn.query(
            `SELECT 
  p.id,
  p.titulo,
  p.contenido,
  p.created_at,
  u.nombre_publico,
  u.avatar_url
FROM posts p
JOIN usuarios u ON p.user_id = u.id
ORDER BY p.created_at DESC`
        );

        res.json(rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error obteniendo posts" });

    } finally {

        conn.release();

    }

}
);
// Borrar post
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const conn = await pool.getConnection();
    try {
        const result = await conn.query("DELETE FROM posts WHERE id=?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No encontrado" });
        }

        return res.json({ ok: true, id });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Error borrando post" });
    } finally {
        conn.release();
    }
});
// Posts de un usuario
router.get("/user/:userId", async (req, res) => {
    const userId = Number(req.params.userId);
    if (!Number.isFinite(userId)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            `SELECT p.id, p.titulo, p.contenido, p.created_at,
              u.nombre_publico, u.avatar_url
       FROM posts p
       JOIN usuarios u ON p.user_id = u.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error obteniendo posts" });
    } finally {
        conn.release();
    }
});

module.exports = router;