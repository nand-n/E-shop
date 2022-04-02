const mongoose =require('mongoose')

const catagorySchema= mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    icon:{
            type:String,
            
     },
    color: {
            type :String ,
            
    },


    

})



exports.Catagory=mongoose.model('Catagory',catagorySchema)


