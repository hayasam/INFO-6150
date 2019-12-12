const express = require("express");
const router = express.Router();

const {
    create
} = require("../controller/products");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");
const { userbyId } = require("../controller/user");

router.post("/products/create/:userId", requireSignin, isAuth, isAdmin, create);

router.param("userId", userbyId);


module.exports = router;
