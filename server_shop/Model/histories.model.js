const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    idProduct: {
      type: String,
      required: true,
    },

    nameProduct: {
      type: String,
      required: true,
    },

    priceProduct: {
      type: Number,
      required: true,
      min: 0,
    },

    count: {
      type: Number,
      required: true,
      min: 1,
    },

    img: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const schema = new mongoose.Schema(
  {
    orderCode: {
      type: Number,
      default: () => Date.now(),
    },

    idUser: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    cart: {
      type: [orderItemSchema],
      default: [],
    },

    total: {
      type: String,
      default: "0",
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "PAYOS"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PENDING", "PAID", "FAILED", "CANCELLED"],
      default: "UNPAID",
    },

    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    status: {
      type: Boolean,
      default: false,
    },

    delivery: {
      type: Boolean,
      default: false,
    },

    paymentLinkId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Histories = mongoose.model("Histories", schema, "histories");

module.exports = Histories;
