const express=require('express')
const router=express.Router();

const{create,categoryById,read,update,remove,list}=require('../controller/category');
const {requireSignin, isAuth, isAdmin }=require("../controller/auth");

const{userbyId}=require("../controller/user");
router.get('/category/:categoryId', read);

router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);

router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param("userId",userbyId);
router.param('categoryId', categoryById);
router.get('/categories', list);

module.exports=router;