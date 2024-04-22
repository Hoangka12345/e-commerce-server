"use strict";

const { HEADER } = require("../constants");
const { AuthFailureError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const { findApiKeyByKey } = require("../services/apiKey.service");

const apiKey = asyncHandler(async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) throw new AuthFailureError();

    const objKey = await findApiKeyByKey(key);
    if (!objKey) throw new AuthFailureError();

    req.objKey = objKey;
    return next();
});

const permission = (permission) => {
    return (req, res, next) => {
        // console.log(req.objKey.permissions);
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "permission denied",
            });
        }

        const validPermission = req.objKey.permissions.includes(permission);
        // console.log(validPermission);
        if (!validPermission) {
            return res.status(403).json({
                message: "permission denied",
            });
        }

        return next();
    };
};

module.exports = {
    apiKey,
    permission,
};
