const mongoose = require("mongoose");

const DegreeSchema = new mongoose.Schema(
  {
    code: String,
    school_address: String,
    ipfs_url_bytes: String,
    status: String,
    timestamp: Boolean,
    objectId: String,
    digest: String,
    address_user_create: String,
  },
  {
    timestamps: true,
  }
);

const degree = mongoose.model("Degree", DegreeSchema);

module.exports = degree;
