import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  token: {
    type: Number,
    required: true,
    unique: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.models.Token || mongoose.model("Token", tokenSchema);
