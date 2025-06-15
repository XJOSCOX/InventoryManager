const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    sellProduct,
} = require("../models/productModel");
const { authenticate } = require("../middlewares/authMiddleware");

// GET all products
router.get("/", authenticate, (req, res) => {
    const products = getAllProducts();
    res.json(products);
});

// POST create new product
router.post("/", authenticate, (req, res) => {
    const { name, sku, quantity, price, tags, expirationDate } = req.body;
    if (!name || !sku || !quantity || !price) {
        return res.status(400).json({ msg: "Missing required fields." });
    }
    const newProduct = createProduct({ name, sku, quantity, price, tags, expirationDate });
    res.status(201).json(newProduct);
});

// PUT update product
router.put("/:id", authenticate, (req, res) => {
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ msg: "Product not found." });
    res.json(updated);
});

// DELETE product
router.delete("/:id", authenticate, (req, res) => {
    const success = deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ msg: "Product not found." });
    res.json({ msg: "Product deleted." });
});

// POST simulate sale of product
router.post("/sell/:id", authenticate, (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ msg: "Invalid quantity." });
    }
    const sold = sellProduct(req.params.id, quantity);
    if (!sold) return res.status(400).json({ msg: "Sale failed (not enough stock or product not found)." });
    res.json(sold);
});

module.exports = router;
