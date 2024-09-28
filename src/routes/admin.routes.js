import { Router } from "express";
import {
  approveProduct,
  getProductsForReview,
  publishProduct,
  rejectProduct,
  searchProducts,
} from "../controllers/product.controllers.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/products").get(verifyAdminJWT, getProductsForReview);
router.route("/product/approve/:id").post(verifyAdminJWT, approveProduct);
router.route("/product/reject/:id").post(verifyAdminJWT, rejectProduct);
router.route("/product/publish/:id").post(verifyAdminJWT, publishProduct);
router.route("/products").post(verifyAdminJWT, searchProducts);

export default router;
