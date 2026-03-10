import {Router} from "express"
import {verifyUser} from "../../middleware/auth.middleware.js"
import {
getAllProducts,
getProductById,
updateProduct,
deleteProduct,
adjustStock,
createProduct } from "./product.controller.js"

const Productrouter = Router()

Productrouter.get("/", verifyUser, getAllProducts)
Productrouter.get("/:id", verifyUser, getProductById)
Productrouter.post("/", verifyUser, createProduct)
Productrouter.put("/:id", verifyUser, updateProduct)
Productrouter.patch("/:id/adjust-stock", verifyUser, adjustStock)
Productrouter.delete("/:id", verifyUser, deleteProduct)

export default Productrouter

