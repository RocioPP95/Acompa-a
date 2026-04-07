require("dotenv").config();
const express = require("express");
const cors = require("cors");

const rutasUsuarios = require("./routes/usuarios.routes");
const rutasRecursos = require("./routes/recursos.routes");
const rutasAlerts = require("./routes/alerts.routes");
const rutasContactos = require("./routes/contactos.routes");
const rutasPosts = require("./routes/posts.routes");
const rutasComments = require("./routes/comments.routes");
const rutasOfertas = require("./routes/ofertas.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/usuarios", rutasUsuarios);
app.use("/recursos", rutasRecursos);
app.use("/alerts", rutasAlerts);
app.use("/contactos", rutasContactos);
app.use("/posts", rutasPosts);
app.use("/comments", rutasComments);
app.use("/ofertas", rutasOfertas);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
});

