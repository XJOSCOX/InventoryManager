const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/", getAllProducts);
router.post("/", authenticate, authorize(["admin", "manager"]), addProduct);
router.put("/:id", authenticate, authorize(["admin", "manager"]), updateProduct);
router.delete("/:id", authenticate, authorize(["admin"]), deleteProduct);

module.exports = router;
