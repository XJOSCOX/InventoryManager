const { products } = require("../models/productModel");

// Get all products
const getAllProducts = (req, res) => {
    res.json(products);
};

// Add a new product
const addProduct = (req, res) => {
    const { name, sku, price, quantity, tags } = req.body;

    if (!name || !sku || !price || !quantity) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const newProduct = {
        id: products.length + 1,
        name,
        sku,
        price,
        quantity,
        tags: tags || [],
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
};

// Update product by ID
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, sku, price, quantity, tags } = req.body;

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    product.name = name ?? product.name;
    product.sku = sku ?? product.sku;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.tags = tags ?? product.tags;

    res.json(product);
};

// Delete product by ID
const deleteProduct = (req, res) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const deleted = products.splice(index, 1);
    res.json({ message: "Product deleted", deleted });
};

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
};
