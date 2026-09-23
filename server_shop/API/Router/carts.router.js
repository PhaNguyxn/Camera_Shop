const express = require("express");

const router = express.Router();

const Carts = require("../Controller/carts.controller");

const { verifyToken } = require("../../Middleware/auth.middleware");

router.get("/", verifyToken, Carts.index);

router.post("/add", verifyToken, Carts.addToCart);

router.delete("/delete", verifyToken, Carts.deleteToCart);

router.put("/update", verifyToken, Carts.updateToCart);

module.exports = router;
