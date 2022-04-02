const express =require('express')
const bodyParser =require('body-parser')
const app =express()
const  morgan = require('morgan')
const mongoose =require('mongoose')
const cors =require('cors')
            
const productRouter=require('./routers/products')
const catagoriesRouter =require('./routers/catagories')
const ordersRouter =require('./routers/orders')
const usersRouter =require('./routers/users')

app.use(cors())
app.options('*', cors())
require('dotenv/config')



//middeleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

//routers


const   api = process.env.API_URL

app.use(`${api}/products`,productRouter)
app.use(`${api}/catagories`,catagoriesRouter)
app.use(`${api}/orders`,ordersRouter)
app.use(`${api}/users`,usersRouter)




mongoose.connect(process.env.CONNECTOIN_STRING)
    .then(()=> console.log('Databse Connection is ready......'))
    .catch((err)=> console.log(err))

const port =process.env.PORT
app.listen(port,()=>console.log(`Server is running http://localhost:${3000}`))