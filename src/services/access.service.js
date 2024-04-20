"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getDataInfo } = require("../utils");
const {
    ConflictError,
    UnauthorizedError,
    AuthFailureError,
} = require("../core/error.response");
const { findShopByEmail } = require("./shop.service");
const { ROLE } = require("../constants/role");

class AccessService {
    static login = async ({ email, password }) => {
        const foundShop = await findShopByEmail(email);
        if (!foundShop) {
            throw new ConflictError("shop has not registered");
        }

        const validPassword = await bcrypt.compare(password, foundShop.password);
        if (!validPassword) {
            throw new UnauthorizedError("Authentication error");
        }

        const publicKey = crypto.randomUUID();
        const privateKey = crypto.randomUUID();

        const { _id: userId } = foundShop;

        const tokens = await createTokenPair(
            {
                userId,
                email,
            },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            shop: getDataInfo(["_id", "name", "email"], foundShop),
            tokens,
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKey(keyStore._id);
        return delKey;
    };

    static signup = async ({ name, email, password }) => {
        // check email exsisted?
        const holdelShop = await shopModel.findOne({ email }).lean();

        if (holdelShop) {
            throw new ConflictError("This email has already existed!");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
            roles: [ROLE.SHOP],
        });

        if (newShop) {
            const publicKey = crypto.randomUUID();
            const privateKey = crypto.randomUUID();

            const tokens = await createTokenPair(
                {
                    userId: newShop._id,
                    email,
                },
                publicKey,
                privateKey
            );

            await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
            });

            return {
                shop: getDataInfo(["_id", "name", "email"], newShop),
                tokens,
            };
        }
        return null;
    };

    static handleRefreshToken = async (user, keyStore, refreshToken) => {
        const { userId, email } = user;

        const isUsedRefreshToken = keyStore.refreshTokensUsed.includes(refreshToken);
        if (isUsedRefreshToken) {
            await KeyTokenService.removeKey(keyStore._id);
            throw new UnauthorizedError("something went worng. Please login again!");
        }

        if (keyStore.refreshToken !== refreshToken)
            throw new AuthFailureError("shop hasn't logged in");

        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        await KeyTokenService.updateKeyToken(refreshToken, tokens.refreshToken);

        return {
            user: { userId, email },
            tokens,
        };
    };
}

module.exports = AccessService;
