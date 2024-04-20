"use strict";

const { filter } = require("lodash");
const keyTokenModel = require("../models/keyToken.model");
const { default: mongoose } = require("mongoose");
const {
    findAndUpdate,
    findByUserId,
    updateRefreshToken,
    deleteById,
} = require("../models/repositories/keyToken.repo");
const { ServerError } = require("../core/error.response");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
            const options = { upsert: true, new: true };

            const keyStore = await findAndUpdate(filter, update, options);
            return keyStore ? keyStore.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findKeyTokenByUser = async (userId) => {
        try {
            const keyToken = await findByUserId(userId);
            if (!keyToken) return null;
            return keyToken;
        } catch (error) {
            throw error;
        }
    };

    static updateKeyToken = async (oldRefreshToken, newRefreshToken) => {
        const filter = { refreshToken: oldRefreshToken };
        const update = {
            $set: { refreshToken: newRefreshToken },
            $addToSet: { refreshTokensUsed: oldRefreshToken },
        };
        const keyStore = await updateRefreshToken(filter, update);
        if (!keyStore) throw new ServerError("update refresh token error");
        return keyStore;
    };

    static removeKey = async (id) => {
        const delKeyToken = await deleteById(id);
        if (!delKeyToken) throw new ServerError("delete key token error");
        return delKeyToken;
    };
}

module.exports = KeyTokenService;
