const router = require("express").Router();
const p = require("../controllers/product.controller");

router.post("/", p.createProduct);
router.get("/", p.getProducts);
router.get("/:id", p.getProductById);

module.exports = router;
