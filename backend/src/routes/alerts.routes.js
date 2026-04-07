const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middlewares/auth");


// Crear alerta SOS
router.post("/",auth, async (req, res) => {
  const { user_id, lat, lng } = req.body;

  // Validación correcta
  if (user_id === undefined || lat === undefined || lng === undefined) {
    return res.status(400).json({ message: "user_id, lat y lng son obligatorios" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO panic_alerts (user_id, lat, lng, status) VALUES (?, ?, ?, 'OPEN')",
      [user_id, lat, lng]
    );

    return res.status(201).json({
      message: "Alerta SOS creada",
      id: Number(result.insertId),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creando alerta" });
  } finally {
    conn.release();
  }
});

// Cerrar alerta SOS
router.patch("/:id/close", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "UPDATE panic_alerts SET status='CLOSED', closed_at=NOW() WHERE id=? AND status='OPEN'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Alerta no encontrada o ya cerrada" });
    }

    return res.json({ ok: true, id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error cerrando alerta" });
  } finally {
    conn.release();
  }
});

module.exports = router;