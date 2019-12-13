const express = require("express");
const router = express.Router();

const {
    create,productById,read, remove,update,list, listRelated,listCategories,listBySearch,photo,listSearch
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

router.get("/product", list);
router.get("/product/search", listSearch);
router.get("/product/related/:productId", listRelated);
router.get("/product/categories", listCategories);
router.post("/product/by/search", listBySearch);
router.get("/product/photos/:productId", photo);

router.param("userId", userbyId);
router.param("productId",productById);

module.exports = router;
