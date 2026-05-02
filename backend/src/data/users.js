const bcrypt = require("bcryptjs");

// In production: replace with real database
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@vietrealestate.vn",
    // password: admin123
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "admin",
    createdAt: "2026-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "Minh Tuấn",
    email: "minhtuan@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "agent",
    createdAt: "2026-02-15",
    status: "active",
  },
];

module.exports = users;
