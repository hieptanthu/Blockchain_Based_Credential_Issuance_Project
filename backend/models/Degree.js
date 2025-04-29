const mongoose = require("mongoose");

const DegreeSchema = new mongoose.Schema(
  {
    code: String,
    school_address: String,
    status: Boolean,
    objectId: String,
    address_user_create: String,
  },
  {
    timestamps: true,
  }
);

const degree = mongoose.model("Degree", DegreeSchema);

module.exports = degree;
