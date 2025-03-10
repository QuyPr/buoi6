const express = require("express");
const Role = require("../models/Role");

const router = express.Router();

// Lấy danh sách Role
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy Role theo ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role không tồn tại" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa mềm Role (xóa cứng vì không có status)
router.delete("/:id", async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: "Role đã bị xóa" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
