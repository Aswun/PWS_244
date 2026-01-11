const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

router.post("/api-products", auth, role("admin"), adminController.create);
router.get("/api-products", auth, role("admin"), adminController.getAll);
router.put("/api-products/:id", auth, role("admin"), adminController.update);
router.delete("/api-products/:id", auth, role("admin"), adminController.remove);

module.exports = router;
