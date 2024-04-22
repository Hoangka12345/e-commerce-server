"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

// search products
router.get("", asyncHandler(productController.getAllProducts));
router.get("/search", asyncHandler(productController.getAllProductsBySearch));
router.get("/:id", asyncHandler(productController.getOneProduct));

// authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProduct));
router.post("/unpublish/:id", asyncHandler(productController.unpublishProduct));

// update
router.patch("/:id", asyncHandler(productController.updateProduct));

// query
router.get("/draft/all", asyncHandler(productController.getAllDraftProductsForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishedProductsForShop)
);

module.exports = router;
