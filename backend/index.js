import dotenv from "dotenv"
import app from "./src/app.js"
import prisma from "./src/db/index.js"

dotenv.config({
    path: "./.env"
})


const PORT = process.env.PORT || 5000


const init = async () => {
    try {
      await prisma.$connect().then(() => {
        console.log("prisma is connected")
      }).catch((error) => {
        console.log("error is connecting prisma : " , error)
      })
      console.log(`Database is connected!!`)
      app.listen(PORT , () =>{
      console.log(`Server is running at PORT: ${PORT}`)
    })
    } catch (error) {
        console.log("Failed in running the server : " , error)
        await prisma.$disconnect()
    }
}


init()