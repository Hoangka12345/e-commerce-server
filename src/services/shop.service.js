"use strict";

const { findByEmail } = require("../models/repositories/shop.repo");
const shopModel = require("../models/shop.model");

const findShopByEmail = async (email) => {
    const select = {
        email: 1,
        password: 1,
        name: 1,
        status: 1,
        roles: 1,
    };
    return await findByEmail(email, select);
};

module.exports = {
    findShopByEmail,
};
