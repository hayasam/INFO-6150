const express=require('express');
const router=express.Router();
const {requireSignin, isAuth, isAdmin }=require("../controller/auth");

const{userbyId,read,update}=require("../controller/user");
router.get("/secret/:userId",requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    } );
});
router.param("userId",userbyId);

router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);

module.exports=router;