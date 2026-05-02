const express = require("express");
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middleware/auth");
let users = require("../data/users");

// GET /api/users (admin)
router.get("/", authMiddleware, adminOnly, (req, res) => {
  const safe = users.map(({ password, ...u }) => u);
  res.json(safe);
});

// PUT /api/users/:id/status (admin)
router.put("/:id/status", authMiddleware, adminOnly, (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  users[idx].status = req.body.status;
  const { password, ...safe } = users[idx];
  res.json(safe);
});

module.exports = router;
