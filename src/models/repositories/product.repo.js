"use strict";

const { default: mongoose } = require("mongoose");
const productModel = require("../product.model");

const findAllProducts = async (filter, sort, skip, limit, select) => {
    return await productModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean();
};

const findOneProduct = async (filter, select) => {
    return await productModel
        .find(filter)
        .populate("product_shop", "-password -roles -__v")
        .select(select)
        .lean();
};

const findAllProductsByFilter = async (filter, skip, limit) => {
    return await productModel
        .find(filter)
        .populate("product_shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
};

const findAllProductsBySearch = async (filter, options, skip, limit, select) => {
    return await productModel
        .find(filter, options)
        // .populate("product_shop", "name email -_id")
        .sort({ ...{ updatedAt: -1 }, ...options })
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean();
};

const updateProductById = async (productId, update, model) => {
    return await model.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(productId) },
        update,
        { new: true }
    );
};

module.exports = {
    findAllProductsByFilter,
    findAllProductsBySearch,
    findAllProducts,
    findOneProduct,
    updateProductById,
};
