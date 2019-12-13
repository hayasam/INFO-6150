const express = require("express");
const router = express.Router();

const {
    create,productById,read, remove,update
} = require("../controller/products");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth");
const { userbyId } = require("../controller/user");

router.get("/products/:productId", read);

router.post("/products/create/:userId", requireSignin, isAuth, isAdmin, create);

router.delete(
    "/products/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/products/:productId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.param("userId", userbyId);
router.param("productId",productById);

module.exports = router;
