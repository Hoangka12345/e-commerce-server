"use strict";

const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new OK({
            message: "login successfully!",
            metadata: await AccessService.login(req.body),
        }).send(res);
    };

    logout = async (req, res, next) => {
        new OK({
            message: "logout successfully!",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res);
    };

    signup = async (req, res, next) => {
        new CREATED({
            message: "shop has registered account successfully!",
            metadata: await AccessService.signup(req.body),
        }).send(res);
    };

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: "get new tokens successfully!",
            metadata: await AccessService.handleRefreshToken(
                req.user,
                req.keyStore,
                req.refreshToken
            ),
        }).send(res);
    };
}

module.exports = new AccessController();
