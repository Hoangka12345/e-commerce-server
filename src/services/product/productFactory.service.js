"use strict";

const Clothing = require("./clothing.service");
const Electronic = require("./electronic.service");

// define factory class
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        this.productRegistry[type] = classRef;
    }

    static async createProduct(userId, type, payload) {
        const ProductClass = this.productRegistry[type];
        if (!ProductClass) throw new BadRequestError("there is no type of product");

        return new ProductClass({ ...payload, product_shop: userId }).createProduct();
    }
}

// create types for product
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
