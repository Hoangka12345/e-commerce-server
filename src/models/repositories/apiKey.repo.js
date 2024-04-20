"use strict";

const apiKeyModel = require("../apiKey.model");

const findByKey = async (key) => {
    try {
        const apiKey = await apiKeyModel.findOne({ key, status: true }).lean();
        if (!apiKey) return null;
        return apiKey;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findByKey,
};
