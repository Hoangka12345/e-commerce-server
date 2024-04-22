"use strict";

const { BadRequestError } = require("../../core/error.response");
const clothingModel = require("../../models/clothing.model");
const { updateProductById } = require("../../models/repositories/product.repo");
const {
    removeUndefiedFromNestedObject,
    removeUndefiedFromObject,
} = require("../../utils");
const Product = require("./product.service");

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError("create clothing error");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("create product error");

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = this;

        if (objectParams.product_attributes) {
            const newAtributes = removeUndefiedFromObject(
                objectParams.product_attributes
            );
            await updateProductById(productId, newAtributes, clothingModel);
        }

        const newObjectParams = removeUndefiedFromNestedObject(objectParams);
        const updateProduct = await super.updateProduct(productId, newObjectParams);
        if (!updateProduct) throw new BadRequestError("update product error");

        return updateProduct;
    }
}

module.exports = Clothing;
