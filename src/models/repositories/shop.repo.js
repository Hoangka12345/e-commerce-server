"use strict";

const shopModel = require("../shop.model");

const findByEmail = async (email, select) => {
    return await shopModel.findOne({ email }).select(select).lean();
};

module.exports = { findByEmail };
