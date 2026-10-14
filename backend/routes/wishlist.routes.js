const router = require("express").Router();
const w = require("../controllers/wishlist.controller");
const protect = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", w.getWishlist);
router.post("/:productId", w.addToWishlist);
router.patch("/:productId/toggle", w.toggleWishlist);
router.delete("/:productId", w.removeFromWishlist);

module.exports = router;
