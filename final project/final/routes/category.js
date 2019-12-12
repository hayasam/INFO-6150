const express=require('express')
const router=express.Router();

const{create}=require('../controller/category');
const {requireSignin, isAuth, isAdmin }=require("../controller/auth");
const{userbyId}=require("../controller/user");
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);

router.param("userId",userbyId);


module.exports=router;