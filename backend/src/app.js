import express from "express"

const app = express()

app.get('/health' , (req,res) => {
    res.json({
        message: "Server is running",
        uptime: process.uptime()
    })
})

export default app