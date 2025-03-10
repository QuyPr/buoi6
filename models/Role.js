const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    deleted: { type: Boolean, default: false }, // Xóa mềm
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
