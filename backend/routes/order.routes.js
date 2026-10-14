const router = require("express").Router();
const o = require("../controllers/order.controller");
const protect = require("../middlewares/auth.middleware");

router.use(protect);

router.post("/create-payment-order", o.createPaymentOrder);
router.post("/verify-payment", o.verifyPayment);
router.get("/", o.getOrders);
router.get("/:id", o.getOrderById);
router.patch("/:id/status", o.updateOrderStatus);

module.exports = router;
