const router=require('express').Router()
const {Product} =require('../models/product')
const {Catagory} =require('../models/catagorie')
const mongoose= require('mongoose')
const multer=require('multer')
const match = require('nodemon/lib/monitor/match')

const FILE_TYPE_MAP={
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
}
const storage=multer.diskStorage({
    destination:function (req,file,cb){
        const isValid=FILE_TYPE_MAP[file.mimetype]
        let uploadError=new Error('invalid Image Type ')
        if(isValid){
            uploadError=null
        }
        cb(uploadError,'public/uploads')
    },
    filename:function (req,file,cb){
        
        const fileName=file.originalname.split(' ').join('-')
        const extention=FILE_TYPE_MAP[file.mimetype]
        cb(null,`${fileName}-${Date.now()}.${extention}`)
    }
})
const uploadOptions=multer({storage:storage})



router.get(`/`, async (req,res)=>{
    
    let filter={}
    if(req.query.catagories){filter={catagory:req.query.catagories.split(',')}}
    
    const productList = await Product.find(filter).populate('catagory')


    if(!productList) return res.status(500).json({sucess:false})

    res.send(productList)
})
router.get(`/:id`, async (req,res)=>{
    
    const product = await Product.findById(req.params.id).populate('catagory')

    if(!product) return  res.status(500).json({sucess:false,message:'There is no any Product with the given id'})

    res.send(product)
})
router.post(`/`,uploadOptions.single('image'), async (req,res)=>{

    var catagory= await Catagory.findById(req.body.catagory)
    if(!catagory)return res.status(400).send('Invalid Catagory...')

    const file=req.file
    if(!file)return res.status(400).send('No image File')
    
    const fileName=req.file.filename
    const basePath=`${req.protocol}://${req.get('host')}/public/upload/`

   const product = await new Product({
       name:req.body.name, 
       description:req.body.description,
       richDescription:req.body.richDescription ,
       image:`${basePath}${fileName}`, 
       brand:req.body.brand,
       price:req.body.price,
       catagory:req.body.catagory,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReview,
       isFeatured:req.body.isFeatured
   }) 
    if (!product) return res.status(400).send('The product uploaded')

    product.save()

    res.send(product) 
})

router.put(`/:id`, async (req,res)=>{

    //validate the id
    if(!mongoose.isValidObjectId (req.params.id)) return res.status(400).send('Invalid Product ID')

    var catagory= await Catagory.findById(req.body.catagory)
    if(!catagory)return res.status(400).send('Invalid Catagory...')
    
   const product = await new Product({
       name:req.body.name,
       description:req.body.description,
       richDescription:req.body.richDescription ,
       image:req.body.image, 
       brand:req.body.brand,
       price:req.body.price,
       catagory:req.body.catagory,
       countInStock:req.body.countInStock,
       rating:req.body.rating,
       numReviews:req.body.numReviews,
       isFeatured:req.body.isFeatured
   }) 
    if (!product) return res.status(400).send('The product can not be updated')
    product.save()
    res.send(product) 
})
router.delete('/:id',async (req,res)=>{
    await Product.findByIdAndDelete(req.params.id)
       .then(product=> {if(product){ res.status(200).json({success:true,message:'The Product is Deleted'})}
                        else{ res.status(400).json({success:false,message:'The Product Could not be Founded '})}} )
       .catch(err => res.status(400).json({success:false, eroor:err}))
})


router.get(`/get/count`, async (req,res)=>{
    const productCount = await Product.countDocuments()
    
    if(!productCount) res.status(500).json({success:false})

    res.send({productCount:productCount})
})
router.get(`/get/featured/:count`, async (req,res)=>{

    //if there is count in a parameter use the given param anless use 0
    const count =req.params.count ? req.params.count :0

    const products = await Product.find({isFeatured:true}).limit(count)
    if(!products) res.status(500).json({success:false})
    res.send(products)
})
router.put('/gallery-images/:id',uploadOptions.array('images',10),async(req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product Id ')
    }
    const files=req.files
    const imagesPaths=[]
    const basePath=`${req.protocol}://${req.get(host)}/public/upload/`
    if(files){
        files.map(file=>{
            imagesPaths.push(`${basePath}${req.file.filename}`)
        })
    }
    const product=await Product.findByIdAndUpdate(req.params.id,{
        images:imagesPaths
    },{new:true})
    if(!product)return res.status(400).send('The product image cannot be updated!!')
    res.send(product)
})

module.exports= router