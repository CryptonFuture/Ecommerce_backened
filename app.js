const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const AuthRoutes = require('./src/routes/authRoutes')
const CartRoutes = require('./src/routes/cartRoutes')
const ProductRoutes = require('./src/routes/productRoutes')
const OrderRoutes = require('./src/routes/orderRoutes')
const path = require("path");

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/user', AuthRoutes)
app.use('/cart', CartRoutes)
app.use('/product', ProductRoutes)
app.use('/order', OrderRoutes)

app.get('/', () => {
    console.log('Services is working');
})

module.exports = app