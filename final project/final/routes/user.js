const express=require('express');
const router=express.Router();
const {requireSignin, isAuth, isAdmin }=require("../controller/auth");

const{userbyId}=require("../controller/user");
router.get("/secret/:userId",requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    } );
});
router.param("userId",userbyId);

module.exports=router;