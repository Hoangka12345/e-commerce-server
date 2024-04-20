"use strict";

const electronicModel = require("../../models/electronic.model");
const Product = require("./product.service");

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
}

module.exports = Electronic;
