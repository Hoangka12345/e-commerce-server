"use strict";

const { default: mongoose } = require("mongoose");
const keyTokenModel = require("../keyToken.model");

const findAndUpdate = async (filter, update, options) => {
    return await keyTokenModel.findOneAndUpdate(filter, update, options);
};

const findByUserId = async (userId) => {
    return await keyTokenModel
        .findOne({ user: new mongoose.Types.ObjectId(userId) })
        .lean();
};

const updateRefreshToken = async (filter, update) => {
    return await keyTokenModel.updateOne(filter, update);
};

const deleteById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
};

module.exports = { findAndUpdate, findByUserId, updateRefreshToken, deleteById };
