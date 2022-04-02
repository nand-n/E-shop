const router=require('express').Router()
const {User} =require('../models/user')

router.get(`/`, async (req,res)=>{
    
    const userList = await User.find()

    if(!userList) res.status(500).json({sucess:false})

    res.send(userList)
})

router.post('/',async (req,res)=>{
    var user =await new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:req.body.passwordHash,
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country

    })

    user.save()

    if(!user) return res.status(404).send('The User can not be created')
    
    res.send(catagory )
})

module.exports= router