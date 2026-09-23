const express = require("express");

const router = express.Router();

const Users = require("../Controller/users.controller");

const { verifyToken, isAdmin } = require("../../Middleware/auth.middleware");

router.post("/signup", Users.signup);
router.post("/login", Users.login);

router.get("/", verifyToken, isAdmin, Users.index);

router.get("/:id", verifyToken, isAdmin, Users.detail);

router.put("/:id", verifyToken, isAdmin, Users.update);

router.delete("/:id", verifyToken, isAdmin, Users.delete);

module.exports = router;
