const express = require("express");

// const auth = require("../middleware/auth.js");
const {
  createProduct,
  fetchProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  getProducts,
  searchByCategory,
  cartItems,
  searchByDisplay,
} = require("../controller/ProductController.js");

const router = express.Router();

router.post("/", createProduct);
router.get("/", fetchProducts);
router.get("/limited", getProducts);
router.get("/category", searchByCategory);
router.get("/cartItems", cartItems);
router.get("/display", searchByDisplay);
router.get("/:id", fetchSingleProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
