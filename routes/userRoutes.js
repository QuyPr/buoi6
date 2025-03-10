const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 🟢 CREATE: Thêm user mới
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔵 READ: Lấy tất cả user có tìm kiếm
router.get("/", async (req, res) => {
  try {
    const { username, fullName, minLogin, maxLogin } = req.query;
    let filter = { deleted: false };

    if (username) filter.username = new RegExp(username, "i");
    if (fullName) filter.fullName = new RegExp(fullName, "i");
    if (minLogin) filter.loginCount = { $gte: Number(minLogin) };
    if (maxLogin) filter.loginCount = { ...filter.loginCount, $lte: Number(maxLogin) };

    const users = await User.find(filter).populate("role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 READ: Lấy user theo ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔵 READ: Lấy user theo username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username, deleted: false }).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 UPDATE: Cập nhật thông tin user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, deleted: false }, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔴 DELETE: Xóa mềm user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User soft deleted", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
