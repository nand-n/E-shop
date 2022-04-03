const router=require('express').Router()
const Order =require('../models/order')

router.get(`/`, async (req,res)=>{
    
    const orderList = await Order.find()

    if(!orderList) res.status(500).json({sucess:false})

    res.send(orderList)
})



module.exports= router

