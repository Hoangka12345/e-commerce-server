"use strict";

const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_slug: {
            type: String,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: {
            type: String,
        },
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronic", "Clothing", "furniture"],
        },
        product_shop: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
        product_attributes: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        Product_ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be more than or equal 1"],
            max: [5, "Rating must be less than or equal 5"],
            set: (val) => Math.round(val * 10) / 10,
        },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// create index for search
productSchema.index({ product_name: "text" });

// generate product slug before create new
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, productSchema);
