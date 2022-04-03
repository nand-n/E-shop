const router=require('express').Router()
const {User} =require('../models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

router.get(`/`, async (req,res)=>{
    
    const userList = await User.find().select('name phone email')

    if(!userList) res.status(500).json({sucess:false})

    res.send(userList)
})
router.get('/:id',async (req,res)=>{
    const user = await User.findById(req.params.id).select('name phone email')
    if(!user) return res.status(500).json({message:'The User with the given ID was not found'})
    res.status(200).send(user)
})
router.post('/',async (req,res)=>{
    var user =await new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync( req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        apartment:req.body.apartment,
        zip:req.body.zip,
        street:req.body.street,
        city:req.body.city,
        country:req.body.country

    })

    

    if(!user) return res.status(404).send('The User can not be created')
    user.save()
    res.send(user )
})

router.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.email})
    const secret=process.env.SECRET
    
    if(!user) return res.status(400).send('The User is not Found ')
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign(
            {userId:user.id},
            secret,
            {expiresIn:'1d'}
            
            )
        res.status(200).send({user:user.email ,token:token})
    }
    else{ res.status(400).send('Password is Wrong ')} 
    
})
module.exports= router