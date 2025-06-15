const express = require("express");
const router = express.Router();
const { getAllTransactions } = require("../models/transactionModel");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/", authenticate, (req, res) => {
    res.json(getAllTransactions());
});

module.exports = router;
