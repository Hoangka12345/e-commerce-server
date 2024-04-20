"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Clothing";
const COLLECTION_NAME = "Clothings";

// Declare the Schema of the Mongo model
var clothingSchema = new mongoose.Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: {
            type: String,
        },
        material: {
            type: String,
        },
        product_shop: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Shop",
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, clothingSchema);
