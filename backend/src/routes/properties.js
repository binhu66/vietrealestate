const express = require("express");
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middleware/auth");
let properties = require("../data/properties");

// GET /api/properties
router.get("/", (req, res) => {
  const { type, category, city, district, minPrice, maxPrice, minArea, maxArea, q, page = 1, limit = 12 } = req.query;

  let filtered = [...properties].filter((p) => p.status === "active");

  if (type) filtered = filtered.filter((p) => p.type === type);
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (city) filtered = filtered.filter((p) => p.city === city);
  if (district) filtered = filtered.filter((p) => p.district === district);
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.address.toLowerCase().includes(lower) ||
        p.district.toLowerCase().includes(lower)
    );
  }
  if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  if (minArea) filtered = filtered.filter((p) => p.area >= Number(minArea));
  if (maxArea) filtered = filtered.filter((p) => p.area <= Number(maxArea));

  const total = filtered.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = filtered.slice(start, start + Number(limit));

  res.json({ data: paginated, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) });
});

// GET /api/properties/:id
router.get("/:id", (req, res) => {
  const property = properties.find((p) => p.id === req.params.id);
  if (!property) return res.status(404).json({ error: "Not found" });
  res.json(property);
});

// POST /api/properties (admin)
router.post("/", authMiddleware, adminOnly, (req, res) => {
  const newProp = {
    ...req.body,
    id: String(Date.now()),
    postedAt: new Date().toISOString().split("T")[0],
    status: "active",
    views: 0,
  };
  properties.push(newProp);
  res.status(201).json(newProp);
});

// PUT /api/properties/:id (admin)
router.put("/:id", authMiddleware, adminOnly, (req, res) => {
  const idx = properties.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  properties[idx] = { ...properties[idx], ...req.body };
  res.json(properties[idx]);
});

// DELETE /api/properties/:id (admin)
router.delete("/:id", authMiddleware, adminOnly, (req, res) => {
  const idx = properties.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  properties[idx].status = "deleted";
  res.json({ success: true });
});

module.exports = router;
