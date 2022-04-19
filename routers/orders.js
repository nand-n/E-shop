const router=require('express').Router()
const { Catagory } = require('../models/catagorie')
const {Order} =require('../models/order')
const {OrderItem}= require('../models/order-item')

router.get(`/`, async (req,res)=>{
    
    const orderList = await Order.find().populate('user','name').sort('+dateOrdered' )

    if(!orderList) res.status(500).json({sucess:false})

    res.send(orderList)
})

router.post('/',async(req,res)=>{
    const orderItemsIds=Promise.all( req.body.orderItems.map(async orderItem =>{
        let NewOrderItem=new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product

        })

        NewOrderItem=await NewOrderItem.save()
        return NewOrderItem._id
    }))

    const orderItemsIdsResolved=await orderItemsIds
    
 
    let order= new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:req.body.totalPrice,
        user:req.body.user
        
    })

     order=await order.save()

    if(!order){
    
        return res.status(400).send('The Order cannot be Created!!!')
    
    }
    
    res.send(order)

})


module.exports= router