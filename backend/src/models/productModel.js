const { v4: uuidv4 } = require("uuid");
const { logTransaction } = require("./transactionModel");

let products = [];

// Create a new product
function createProduct({ name, sku, quantity, price, tags, expirationDate }) {
    const product = {
        id: uuidv4(),
        name,
        sku,
        quantity,
        price,
        tags,
        expirationDate,
        totalSold: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
    };
    products.push(product);

    // Log the addition
    logTransaction({
        type: "add",
        productId: product.id,
        quantity: product.quantity,
        orderId: null,
        details: { name: product.name },
    });

    return product;
}

// Get all products
function getAllProducts() {
    return products;
}

// Get a single product by ID
function getProductById(id) {
    return products.find((p) => p.id === id);
}

// Update an existing product
function updateProduct(id, data) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = {
        ...products[index],
        ...data,
    };

    // Log the edit
    logTransaction({
        type: "edit",
        productId: id,
        quantity: data.quantity ?? null,
        orderId: null,
        details: { ...data },
    });

    return products[index];
}

// Delete a product
function deleteProduct(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    // Log the deletion
    logTransaction({
        type: "delete",
        productId: id,
        quantity: null,
        orderId: null,
        details: null,
    });

    products.splice(index, 1);
    return true;
}

// Sell (decrement quantity, update stats)
function sellProduct(id, quantitySold) {
    const product = getProductById(id);
    if (!product || product.quantity < quantitySold) return null;
    product.quantity -= quantitySold;
    product.totalSold += quantitySold;
    product.revenue += quantitySold * product.price;

    // Log the sale
    const orderId = "SALE-" + Date.now();
    logTransaction({
        type: "sale",
        productId: id,
        quantity: quantitySold,
        orderId,
        details: null,
    });

    return product;
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    sellProduct,
};
