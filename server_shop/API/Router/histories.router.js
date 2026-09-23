const express = require("express");

const router = express.Router();

const Histories = require("../Controller/histories.controller");

const { verifyToken, isAdmin } = require("../../Middleware/auth.middleware");

router.get("/all", verifyToken, isAdmin, Histories.history);

router.put("/update-status/:id", verifyToken, isAdmin, Histories.updateStatus);

router.put("/update-order/:id", verifyToken, isAdmin, Histories.updateOrder);

router.get("/", verifyToken, Histories.index);

router.post("/", verifyToken, Histories.postHistory);

router.get("/:id", verifyToken, Histories.detail);

module.exports = router;
