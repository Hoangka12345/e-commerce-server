"use strict";

const { CREATED } = require("../core/success.response");
const ProductFactory = require("../services/product/productFactory.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: "create new product successfully!",
            metadata: await ProductFactory.createProduct(
                req.userId,
                req.body.product_type,
                req.body
            ),
        }).send(res);
    };
}

module.exports = new ProductController();
