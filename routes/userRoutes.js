const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Lấy danh sách người dùng có tìm kiếm
router.get("/", async (req, res) => {
  try {
    let { username, fullName, minLogin, maxLogin } = req.query;
    let filter = {};

    if (username) filter.username = new RegExp(username, "i");
    if (fullName) filter.fullName = new RegExp(fullName, "i");
    if (minLogin) filter.loginCount = { $gte: Number(minLogin) };
    if (maxLogin) filter.loginCount = { ...filter.loginCount, $lte: Number(maxLogin) };

    const users = await User.find(filter).populate("role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy user theo ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy user theo username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate("role");
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa mềm User (chuyển status về false)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json({ message: "Đã vô hiệu hóa user", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật trạng thái user khi đúng email và username
router.post("/verify", async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username });

    if (!user) return res.status(404).json({ message: "Email hoặc username không đúng" });

    user.status = true;
    await user.save();
    res.json({ message: "User đã được kích hoạt", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
