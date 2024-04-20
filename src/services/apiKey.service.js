"use strict";

const { findByKey } = require("../models/repositories/apiKey.repo");

const findApiKeyByKey = async (key) => {
    return await findByKey(key);
};

module.exports = {
    findApiKeyByKey,
};
