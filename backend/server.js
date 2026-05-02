require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/properties", require("./src/routes/properties"));
app.use("/api/stats", require("./src/routes/stats"));
app.use("/api/users", require("./src/routes/users"));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
