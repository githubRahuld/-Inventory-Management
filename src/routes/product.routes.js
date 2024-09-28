import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct } from "../controllers/product.controllers.js";

const router = Router();

router.route("/create-product").post(
  upload.fields([
    {
      name: "images",
      maxCount: 5,
    },
  ]),
  createProduct
);

export default router;
