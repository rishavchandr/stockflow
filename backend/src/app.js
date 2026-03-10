import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/health' , (req,res) => {
    res.json({
        message: "Server is running",
        uptime: process.uptime()
    })
})

//auth 
import router from "./modules/auth/auth.router.js"
app.use('/api/v1/user' , router)

//product 
import Productrouter from "./modules/product/product.routes.js"
app.use('/api/v1/products' , Productrouter)


export default app