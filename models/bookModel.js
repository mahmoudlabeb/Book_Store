const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    author:      { type: String, required: true },
    category:    { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String },
    owners:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { versionKey: false }
);

module.exports = mongoose.model("Book", bookSchema);
