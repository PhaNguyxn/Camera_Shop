const express = require("express");

const router = express.Router();

const Products = require("../Controller/products.controller");

const { verifyToken, isAdmin } = require("../../Middleware/auth.middleware");

router.get("/", Products.index);

router.get("/category", Products.category);

router.get("/category/list", Products.categories);

router.get("/pagination", Products.pagination);

router.get("/category/detail/:id", Products.detailCategory);

router.post("/category/create", verifyToken, isAdmin, Products.createCategory);

router.put(
  "/category/update/:id",
  verifyToken,
  isAdmin,
  Products.updateCategory,
);

router.delete(
  "/category/delete/:id",
  verifyToken,
  isAdmin,
  Products.deleteCategory,
);

router.post("/create", verifyToken, isAdmin, Products.createProduct);

router.put("/update/:id", verifyToken, isAdmin, Products.updateProduct);

router.delete("/:id", verifyToken, isAdmin, Products.deleteProduct);

router.get("/:id", Products.detail);

module.exports = router;
