const router=require('express').Router()
const { Catagory } = require('../models/catagorie')
const {Order} =require('../models/order')
const {OrderItem}= require('../models/order-item')
const { Product } = require('../models/product')

router.get(`/`, async (req,res)=>{
    
    const orderList = await Order.find().populate('user','name').sort({'dateOrdered':-1})

    if(!orderList) res.status(500).json({sucess:false})

    res.send(orderList)
})

router.post('/',async(req,res)=>{
    const orderItemsIds=Promise.all( req.body.orderItems.map(async orderItem =>{
        let NewOrderItem=await new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product

        })

        NewOrderItem=await NewOrderItem.save()
        return NewOrderItem._id
    }))

    const orderItemsIdsResolved=await orderItemsIds
    
    const totalPrices=await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem=await OrderItem.findById(orderItemId).populate('product','price' )
        const totalPrice=orderItem.product.price*orderItem.quantity
        
        return totalPrice
    }))

    const totalPrice=totalPrices.reduce((a,b)=>a+b,0)
    console.log(totalPrices)
       
       
    let order= new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        user:req.body.user,
        
        
    })

     order=await order.save()

    if(!order){
    
        return res.status(400).send('The Order cannot be Created!!!')
    
    }
    
    res.send(order)

})



router.put('/:id',async (req,res)=>{
    const order =await Order.findByIdAndUpdate(req.params.id,{
        status:req.body.status
    },{new :true})
    
    if(!order) return res.status(404).send('The Order can not be Updated') 
    res.send(order )
})

router.get('/:id',async (req,res)=>{
    
    const order =await Order.findById(req.params.id)
        .populate('user','name')
        .populate({
            path:'orderItems',populate:{
                path:'product',populate:'catagory'
            }
        })
    
    if(!order) return res.status(404).send('The Order can not be Updated') 
    res.send(order )
})

router.delete('/:id',async(req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{

        if(order){
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndRemove(orderItem)
                    .then(res.status(400).json('the orderitem is deleted'))
            })

            return res.status(200).json({success:true,message:'The order is successfully deleted!!!'})}
        
        else{ return res.status(400).json({success:false,message:'The order is not successfully deleted!!!!'})}
    }).catch(err=>{return res.status(500).json({success:false,error:err})})
})

router.get('/get/totalsales',async(req,res)=>{
    const totalSales=await Order.aggregate([
        {$group:{_id:null,totalSales:{$sum:'totalPrice'}}}
    ])
    if (!totalSales){return res.status(400).send('The Order sales cannot be Generated')}
    res.send({totalSales:totalSales.pop().totalSales})
})

router.get(`/get/count`, async (req,res)=>{
    const orderCount = await Order.countDocuments((count)=>count)
    
    if(!orderCount) res.status(500).json({success:false})

    res.send({orderCount:orderCount})
})


router.get(`/get/userorders/:userid`, async (req,res)=>{
    
    const userOrderList = await Order.find({user:req.params.userid})
        .populate('user','name')
        .populate({
        path:'orderItems',populate:{
            path:'product',populate:'catagory'
        }
        })
            .sort({'dateOrdered':-1})

    if(!userOrderList) res.status(500).json({sucess:false})

    res.send(userOrderList)
})


module.exports= router