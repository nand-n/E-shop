const express =require('express')
const bodyParser =require('body-parser')
const app =express()
const  morgan = require('morgan')
const mongoose =require('mongoose')
const cors =require('cors')
require('dotenv/config')
const authJwt = require('./helpers/jwt')
const errorHandler=require('./helpers/error-handler')
            

const api = process.env.API_URL

app.use(cors())
app.options('*', cors())

//middeleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt())  
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))
app.use(errorHandler)

//routers
const productRouter=require('./routers/products')
const catagoriesRouter =require('./routers/catagories')
const ordersRouter =require('./routers/orders')
const usersRouter =require('./routers/users')

 
//routes
app.use(`${api}/products`,productRouter)
app.use(`${api}/catagories`,catagoriesRouter)
app.use(`${api}/orders`,ordersRouter)
app.use(`${api}/users`,usersRouter)



//CONNECTOIN_STRING


mongoose.connect(process.env.LOCAL_CONNECTION)
    .then(()=> console.log('Databse Connection is ready......'))
    .catch((err)=> console.log(err))

const port =process.env.PORT

app.listen(port,()=>console.log(`Server is running http://localhost:${port}`))