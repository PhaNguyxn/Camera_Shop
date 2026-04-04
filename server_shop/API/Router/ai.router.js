const express = require("express");
const router = express.Router();

const aiController = require("../Controller/ai.controller");

router.post("/chat", aiController.chat);

module.exports = router;