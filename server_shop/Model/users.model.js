var mongoose = require("mongoose");

var schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
);

var Users = mongoose.model("Users", schema, "users");

module.exports = Users;
