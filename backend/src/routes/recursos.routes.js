const express = require("express");
const router = express.Router();
const pool = require("../db");

// LISTAR recursos
router.get("/", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, tipo, nombre, direccion, latitud, longitud,
              telefono, web, descripcion_servicios, creado_en
       FROM recursos
       ORDER BY creado_en DESC`
    );
    res.json(rows);
  } finally {
    conn.release();
  }
});
// OBTENER 1 recurso por id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, tipo, nombre, direccion, latitud, longitud,
              telefono, web, descripcion_servicios, creado_en
       FROM recursos
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows[0]) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } finally {
    conn.release();
  }
});

// CREAR recurso
router.post("/", async (req, res) => {
  const {
    tipo,
    nombre,
    direccion,
    latitud,
    longitud,
    telefono,
    web,
    descripcionServicios
  } = req.body;

  if (!tipo || !nombre || latitud === undefined || longitud === undefined) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO recursos
       (tipo, nombre, direccion, latitud, longitud, telefono, web, descripcion_servicios)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tipo, nombre, direccion || null, latitud, longitud, telefono || null, web || null, descripcionServicios || null]
    );

    res.status(201).json({
      id: Number(result.insertId),
      tipo,
      nombre,
      direccion,
      latitud,
      longitud
    });
  } finally {
    conn.release();
  }
});

// ACTUALIZAR recurso (PUT)
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

  const {
    tipo,
    nombre,
    direccion,
    latitud,
    longitud,
    telefono,
    web,
    descripcion_servicios,
  } = req.body;

  // Puedes exigir campos mínimos
  if (!tipo || !nombre || latitud === undefined || longitud === undefined) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `UPDATE recursos
       SET tipo = ?, nombre = ?, direccion = ?, latitud = ?, longitud = ?,
           telefono = ?, web = ?, descripcion_servicios = ?
       WHERE id = ?`,
      [
        tipo,
        nombre,
        direccion || null,
        latitud,
        longitud,
        telefono || null,
        web || null,
        descripcion_servicios || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({
      id,
      tipo,
      nombre,
      direccion: direccion || null,
      latitud,
      longitud,
      telefono: telefono || null,
      web: web || null,
      descripcion_servicios: descripcion_servicios || null,
    });
  } finally {
    conn.release();
  }
});

// BORRAR recurso (DELETE)
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(`DELETE FROM recursos WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json({ ok: true, id });
  } finally {
    conn.release();
  }
});

module.exports = router;
