const router=require('express').Router()
const {Product} =require('../models/product')
const {Catagory} =require('./catagories')

router.get(`/`, async (req,res)=>{
    
    const productList = await Product.find()
        .find({})

    if(!productList) res.status(500).json({sucess:false})

    res.send(productList)
})

router.post(`/`, async (req,res)=>{
    var catagory= await Catagory.findById(req.body.catagory)
    if(!catagory)return res.status(400).send('Invalid Catagory...')
   const product = await new Product({
       name:req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription ,
       image:req.body.image,
       brand:req.body.brand,
       price:req.body.proce,
       catagory:req.body.catagory,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReview:req.body.numReview,
       isFeatured:req.body.isFeatured
   }) 
    if (!product) return res.status(400).send('The product can not be created')
    res.send(product)    
})


module.exports= router