require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rutasUsuarios = require("./routes/usuarios.routes");
const rutasRecursos = require("./routes/recursos.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/usuarios", rutasUsuarios);
app.use("/recursos", rutasRecursos);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});

