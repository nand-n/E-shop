const router=require('express').Router()
const {User} =require('../models/user')

router.get(`/`, async (req,res)=>{
    
    const userList = await User.find()

    if(!userList) res.status(500).json({sucess:false})

    res.send(userList)
})



module.exports= router