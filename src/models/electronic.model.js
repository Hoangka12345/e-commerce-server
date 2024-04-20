"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Electronic";
const COLLECTION_NAME = "Electronics";

// Declare the Schema of the Mongo model
var electronicSchema = new mongoose.Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: {
            type: String,
        },
        color: {
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
module.exports = mongoose.model(DOCUMENT_NAME, electronicSchema);
