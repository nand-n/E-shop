const mongoose =require('mongoose')

const orderSchema= mongoose.Schema({
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
 
    shippingAddress1:{
        type:String,
        required:true
    },

    shippingAddress2:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    }, 
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    totalPrice:{
        type:Number,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    dateOrdered:{
        type:Date,
        defualt:Date.now,
        required:true
    }
})
  
orderSchema.virtual('id').get(function (){
    return this._id.toHexString()
})
orderSchema.set('toJSON',{
    virtuals:true
})

exports.Order=mongoose.model('Order',orderSchema)


/*
order Example
    {
        "orderItems":[
            {
                "quantity":3,
                "product":"fcdafldshafkaskdlfnksdaflkdsaj"
            },
            {
                "quantity":2,
                "product":"fcdafldshafkaskdlfnksdaflkdsaj"
            }
        ],
        "shippingAddress1":"Adama Street ,45",
        "shippingAddress2":"Adama Street ,85",
        "city":"Adama",
        "country":"ET",
        "phone":"+251937108836",
        "user":"gakdsfjhlskdajgfklsdajfkfhaskldjf",
        

     }

 **/