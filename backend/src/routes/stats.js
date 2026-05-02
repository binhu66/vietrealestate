const express = require("express");
const router = express.Router();
const { authMiddleware, adminOnly } = require("../middleware/auth");
const properties = require("../data/properties");
const users = require("../data/users");

// GET /api/stats (admin dashboard)
router.get("/", authMiddleware, adminOnly, (req, res) => {
  const active = properties.filter((p) => p.status === "active");
  const forSale = active.filter((p) => p.type === "ban");
  const forRent = active.filter((p) => p.type === "thue");
  const vip = active.filter((p) => p.isVip);
  const totalViews = active.reduce((sum, p) => sum + (p.views || 0), 0);

  const byCategory = {};
  active.forEach((p) => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  res.json({
    totalProperties: active.length,
    forSale: forSale.length,
    forRent: forRent.length,
    vipListings: vip.length,
    totalViews,
    totalUsers: users.length,
    byCategory,
    recentProperties: active
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
      .slice(0, 5),
  });
});

module.exports = router;
