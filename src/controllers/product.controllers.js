import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, images } = req.body;

  console.log(name);

  // Validate required fields
  if (!name || !description || !price || !quantity) {
    throw new ApiError(400, "All fields are required.");
  }

  // Price and quantity validation
  if (price <= 0) {
    throw new ApiError(400, "Price must be greater than 0.");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0.");
  }

  // Check if images were uploaded
  if (!req.files || !req.files["images"]) {
    return res.status(400).json({ message: "Image(s) are required" });
  }

  // Upload images to Cloudinary
  const imageFiles = req.files["images"]; // Get the uploaded images
  const imageUrls = [];

  for (const image of imageFiles) {
    const localFilePath = image.path;

    // Upload to Cloudinary (assuming you have the upload function)
    const result = await uploadOnCloudinary(localFilePath);
    if (result) {
      imageUrls.push(result.secure_url); // Collect the Cloudinary URLs
    }
  }

  // Create the product
  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    images: imageUrls,
    status: "pending", // By default, all products should be in the "pending" status
  });

  if (!product) {
    throw new ApiError(500, "Product could not be created. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully!"));
});

const getProductsForReview = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: "pending" });

  if (!products) {
    return res.status(404).json({ message: "No products found for review." });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Pending products retrieved successfull")
    );
});

const approveProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.status !== "pending") {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  product.status = "approved";
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product approved successfully"));
});

const rejectProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.status !== "pending") {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  product.status = "rejected";
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product rejected successfully"));
});

const searchProducts = asyncHandler(async (req, res) => {
  const { name, status } = req.query;

  let query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  const products = await Product.find(query);

  if (!products.length) {
    return res.status(404).json({
      message: "No products found matching the search criteria",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

const publishProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if the product is approved
  if (product.status !== "approved") {
    throw new ApiError(400, "Product must be approved before publishing");
  }

  // Update the product status to published
  product.status = "published";
  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product published successfully"));
});

export {
  createProduct,
  getProductsForReview,
  approveProduct,
  rejectProduct,
  searchProducts,
  publishProduct,
};
