const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema(
  {
    code: String,
    fullname: String,
    address_school: String,
    address_manager: String,
    ipfs_url: String,
    status: Boolean,
    objectId: String,
    digest: String,
    address_user_create: String,
  },
  {
    timestamps: true,
  }
);

const school = mongoose.model("School", SchoolSchema);

module.exports = school;
