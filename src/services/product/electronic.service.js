"use strict";

const { BadRequestError } = require("../../core/error.response");
const electronicModel = require("../../models/electronic.model");
const { updateProductById } = require("../../models/repositories/product.repo");
const Product = require("./product.service");
const {
    removeUndefiedFromNestedObject,
    removeUndefiedFromObject,
} = require("../../utils");

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) throw new BadRequestError("create electronic error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("create product error");

        return newProduct;
    }

    async updateProduct(productId) {
        const objectParams = this;

        if (objectParams.product_attributes) {
            const newAtributes = removeUndefiedFromObject(
                objectParams.product_attributes
            );
            await updateProductById(productId, newAtributes, electronicModel);
        }

        const newObjectParams = removeUndefiedFromNestedObject(objectParams);
        const updateProduct = await super.updateProduct(productId, newObjectParams);
        if (!updateProduct) throw new BadRequestError("update product error");

        return updateProduct;
    }
}

module.exports = Electronic;
