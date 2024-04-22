"use strict";

const { CREATED, OK } = require("../core/success.response");
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

    updateProduct = async (req, res, next) => {
        const { id } = req.params;
        new OK({
            message: "update product successfully!",
            metadata: await ProductFactory.updateProduct(
                id,
                req.userId,
                req.body.product_type,
                req.body
            ),
        }).send(res);
    };

    publishProduct = async (req, res, next) => {
        new OK({
            message: "publish product successfully!",
            metadata: await ProductFactory.handlePublishProduct(
                req.userId,
                req.params.id
            ),
        }).send(res);
    };

    unpublishProduct = async (req, res, next) => {
        new OK({
            message: "publish product successfully!",
            metadata: await ProductFactory.handleUnpublishProduct(
                req.userId,
                req.params.id
            ),
        }).send(res);
    };

    // query
    getAllProducts = async (req, res, next) => {
        const { page, sortBy } = req.query;
        new OK({
            message: "get all products successfully!",
            metadata: await ProductFactory.findAllProducts(page, sortBy),
        }).send(res);
    };

    getOneProduct = async (req, res, next) => {
        const { id } = req.params;
        new OK({
            message: "get one product successfully!",
            metadata: await ProductFactory.findOneProduct(id),
        }).send(res);
    };

    getAllDraftProductsForShop = async (req, res, next) => {
        new OK({
            message: "get list of draft products successfully!",
            metadata: await ProductFactory.findAllDraftProductsForShop(req.userId),
        }).send(res);
    };

    getAllPublishedProductsForShop = async (req, res, next) => {
        new OK({
            message: "get list of published products successfully!",
            metadata: await ProductFactory.findAllPublishedProductsForShop(req.userId),
        }).send(res);
    };

    getAllProductsBySearch = async (req, res, next) => {
        new OK({
            message: "get list of published products successfully!",
            metadata: await ProductFactory.findAllProductsBySearch(req.query.name),
        }).send(res);
    };
}

module.exports = new ProductController();
