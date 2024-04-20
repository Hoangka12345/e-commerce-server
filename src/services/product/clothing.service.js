"use strict";

const clothingModel = require("../../models/clothing.model");
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
}

module.exports = Clothing;
