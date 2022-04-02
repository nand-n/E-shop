const router=require('express').Router()
const {Catagory} =require('../models/catagorie')

router.get(`/`, async (req,res)=>{
    
    const catagoryList = await Catagory.find()

    if(!catagoryList) res.status(500).json({sucess:false})

    res.status(200).send(catagoryList)
})

router.get('/:id',async (req,res)=>{
    const catagory = await Catagory.findById(req.params.id)
    if(!catagory) return res.status(500).json({message:'The Catagory with the given ID was not found'})
    res.status(200).send(catagory)
})

router.put('/:id',async (req,res)=>{
    const catagory =await Catagory.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    },{new :true})
    
    if(!catagory) return res.status(404).send('The catagory can not be Updated')
    res.send(catagory )
})

router.post('/',async (req,res)=>{
    var catagory =new Catagory({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })

    catagory =await catagory.save()

    if(!catagory) return res.status(404).send('The catagory can not be created')
    res.send(catagory )
})
router.delete('/:id',async (req,res)=>{
     await Catagory.findByIdAndDelete(req.params.id)
        .then(cataory=> {if(cataory){ res.status(200).json({success:true,message:'The Catagory is Deleted'})}
                         else{ res.status(400).json({success:false,message:'The Catagory Could not be Founded '})}} )
        .catch(err => res.status(400).json({success:false, eroor:err}))
})

// router.delete('/:id', (req,res)=>{
//     Catagory.findByIdAndRemove(req.params.id)
//         .then(catagory=>{
//             if(catagory) return res.status(200).json({success:true,message:'The Catagory is Deleted'})
//             else return res.status(400).json({success:false,message:'Catagory not Found '})
//         })
//         .catch(err => {
//             return res.status(400).json({success:false,error :err})
//         })
// })



module.exports= router