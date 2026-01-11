const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const customerController = require("../controllers/customer.controller");

router.get("/api-products", auth, customerController.getProducts);
router.post("/api-keys", auth, customerController.generateKey);
router.get("/api-keys", auth, customerController.getKeys);

module.exports = router;
