const router=require('express').Router()
const {Order} =require('../models/order')
const {OrderItem}= require('../models/order-item')

router.get(`/`, async (req,res)=>{
    
    const orderList = await Order.find().populate('user')

    if(!orderList) res.status(500).json({sucess:false})

    res.send(orderList)
})

// router.post('/' ,async (req,res)=>{

//     const orderItemsIds=req.body.orderItems.map(async orderItem=>{
//         let newOrderItem = new OrderItem({
//             quantity :orderItem.quantity,
//             product :orderItem.product 
//         })
//         newOrderItem=await  newOrderItem.save()
//         return newOrderItem._id;
//     })
 
//     let order= new Order({
      
//         orderItems:orderItemsIds,
//         shipingAddress1 : res.body.shipingAddress1,
//         shipingAddress2 : res.body.shipingAddress2,
//         city:res.body.city,
//         zip:res.body.zip,
//         country:res.body.country,
//         phone:res.body.phone,
//         status:res.body.status,
//         totalPrice:res.body.totalPrice,
//         user:res.body.user

//     })
//     //order= await order.save();
//     if(!order) return res.status(400).send('The order can not be created ')
//     res.send(order)
// })


router.post('/',async (req,res)=>{
     
    const orderItemsIds =Promise.all( req.body.orderItems.map(async orderItem =>{

        let newOrderItem= new OrderItem({
            
            quantity:orderItem.quantity,

            product:orderItem.product

        })

        if(!newOrderItem) {return res.status(400).send("error the newOrderItem is fiald")}
        newOrderItem= await newOrderItem.save()
        return newOrderItem.id;
    }))

     const orderItemsIdResolved=await orderItemsIds;
     console.log(orderItemsIdResolved);

    
    let order= await new Order({
        orderItems:orderItemsIdResolved,
        shipingAddress1:res.body.shipingAddress1,
        shipingAddress2:res.body.shipingAddress2,
        city:res.body.city,
        zip:res.body.zip,
        country:res.body.country,
        phone:res.body.phone,
        status:res.body.status,
        totalPrice:res.body.totalPrice,
        user:res.body.user,

    })
    // order=await order.save()

    if(!order)return res.status(400).send('The Order can not be placed')
    res.send(order)
})



module.exports= router 

