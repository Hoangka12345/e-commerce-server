"use strict";

const JWT = require("jsonwebtoken");
const { HEADER } = require("../constants");
const {
    UnauthorizedError,
    NotFoundError,
    AuthFailureError,
} = require("../core/error.response");
const { findKeyTokenByUser } = require("../services/keyToken.service");
const { asyncHandler } = require("../helpers/asyncHandler");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // generate accesstoken and refreshtoken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("generate token", error);
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    console.log(userId);
    if (!userId) throw new UnauthorizedError("invalid request");

    const keyStore = await findKeyTokenByUser(userId);
    if (!keyStore) throw new NotFoundError("not found key store");

    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if (refreshToken) {
        try {
            const decodedUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodedUser.userId)
                throw new AuthFailureError("Invalid UserId");
            req.user = decodedUser;
            req.keyStore = keyStore;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError("invalid request");

    try {
        const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodedUser.userId) throw new AuthFailureError("Invalid UserId");
        req.keyStore = keyStore;
        req.userId = userId;
        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = {
    createTokenPair,
    authentication,
};
