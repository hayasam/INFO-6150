const express = require("express");
const router = express.Router();

const {
    create,productById,read
} = require("../controller/products");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");
const { userbyId } = require("../controller/user");

router.get("/products/:productId", read);

router.post("/products/create/:userId", requireSignin, isAuth, isAdmin, create);


router.param("userId", userbyId);
router.param("productId",productById);

module.exports = router;
