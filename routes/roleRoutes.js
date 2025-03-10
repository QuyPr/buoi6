const express = require("express");
const Role = require("../models/Role");

const router = express.Router();

// 🟢 CREATE: Thêm role mới
router.post("/", async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔵 READ: Lấy tất cả role
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find({ deleted: false });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 READ: Lấy role theo ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, deleted: false });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 UPDATE: Cập nhật role
router.put("/:id", async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate({ _id: req.params.id, deleted: false }, req.body, { new: true });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔴 DELETE: Xóa mềm role
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate({ _id: req.params.id }, { deleted: true }, { new: true });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role soft deleted", role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
