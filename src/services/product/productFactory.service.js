"use strict";

const { mongo, default: mongoose } = require("mongoose");
const {
    findAllProductsByFilter,
    updateProduct,
    findAllProductsBySearch,
    findAllProducts,
    findOneProduct,
} = require("../../models/repositories/product.repo");
const Clothing = require("./clothing.service");
const Electronic = require("./electronic.service");
const { BadRequestError, ConflictError } = require("../../core/error.response");
const { LIMIT, SORT_BY } = require("../../constants");
const { getSelectData, unSelectData } = require("../../utils");

// define factory class
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        this.productRegistry[type] = classRef;
    }

    static async createProduct(shopId, type, payload) {
        const ProductClass = this.productRegistry[type];
        if (!ProductClass) throw new BadRequestError("there is no type of product");

        return new ProductClass({ ...payload, product_shop: shopId }).createProduct();
    }

    static async updateProduct(productId, shopId, type, payload) {
        const ProductClass = this.productRegistry[type];
        if (!ProductClass) throw new BadRequestError("there is no type of product");

        if (!productId) throw new BadRequestError("there is no productId");

        return new ProductClass({ ...payload, product_shop: shopId }).updateProduct(
            productId
        );
    }

    // Query Products

    static getSelectData() {
        const selectData = [
            "product_name",
            "product_price",
            "product_thumb",
            "Product_ratingAverage",
            "product_saledQuantity",
        ];
        return getSelectData(selectData);
    }

    static async findAllProducts(page = 1, sortBy = SORT_BY.RELEVANCY) {
        const filter = { isPublished: true };
        const skip = (page - 1) * LIMIT;
        const limit = LIMIT;

        const sort =
            sortBy === SORT_BY.CTIME ? { _id: -1 } : sortBy === SORT_BY.SALES ? {} : {};

        const select = this.getSelectData();

        const products = await findAllProducts(filter, sort, skip, limit, select);

        if (!products) return [];

        return products;
    }

    static async findOneProduct(id) {
        const filter = { _id: new mongoose.Types.ObjectId(id) };

        const select = unSelectData(["__v"]);

        const product = await findOneProduct(filter, select);

        if (!product) throw new ConflictError("this product does not exist");

        return product;
    }

    static async findAllProductsBySearch(keySearch, page = 1) {
        const filter = keySearch
            ? {
                  $text: {
                      $search: `\"${keySearch}\"`,
                  },
                  isPublished: true,
              }
            : { isPublished: true };

        const options = keySearch
            ? {
                  score: { $meta: "textScore" },
              }
            : {};
        const skip = (page - 1) * LIMIT;
        const limit = LIMIT;
        const select = this.getSelectData();

        const products = await findAllProductsBySearch(filter, options, skip, limit, {
            ...select,
            score: -1,
        });

        if (!products) return [];

        return products;
    }

    static async findAllDraftProductsForShop(shopId, page = 1) {
        const filter = {
            product_shop: new mongoose.Types.ObjectId(shopId),
            isDraft: true,
        };
        const skip = (page - 1) * LIMIT;
        const limit = LIMIT;
        const products = await findAllProductsByFilter(filter, skip, limit);
        if (!products) return [];

        return products;
    }

    static async findAllPublishedProductsForShop(shopId, page = 1) {
        const filter = {
            product_shop: new mongoose.Types.ObjectId(shopId),
            isPublished: true,
        };
        const skip = (page - 1) * LIMIT;
        const limit = LIMIT;
        const products = await findAllProductsByFilter(filter, skip, limit);
        if (!products) return [];

        return products;
    }

    // Handle event

    static async handlePublishProduct(shopId, productId) {
        const filter = {
            _id: new mongoose.Types.ObjectId(productId),
            product_shop: new mongoose.Types.ObjectId(shopId),
            isDraft: true,
            isPublished: false,
        };
        const update = {
            $set: { isDraft: false, isPublished: true },
        };

        const options = { new: true };
        const product = await updateProduct(filter, update, options);
        if (!product) throw new ConflictError("cannot find this draft product");

        return product;
    }

    static async handleUnpublishProduct(shopId, productId) {
        const filter = {
            _id: new mongoose.Types.ObjectId(productId),
            product_shop: new mongoose.Types.ObjectId(shopId),
            isDraft: false,
            isPublished: true,
        };
        const update = {
            $set: { isDraft: true, isPublished: false },
        };

        const options = { new: true };
        const product = await updateProduct(filter, update, options);
        if (!product) throw new ConflictError("cannot find this published product");

        return product;
    }
}

// create types for product
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
