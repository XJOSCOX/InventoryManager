const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes); // login route is now /api/login

const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes);


// Default route
app.get("/", (req, res) => {
    res.send("✅ Inventory API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
