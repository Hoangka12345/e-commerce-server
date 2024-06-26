"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/login", asyncHandler(accessController.login));
router.post("/shop/signup", asyncHandler(accessController.signup));

// authentication
router.use(authentication);

router.post(
    "/shop/handle-refreshtoken",
    asyncHandler(accessController.handleRefreshToken)
);
router.post("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
