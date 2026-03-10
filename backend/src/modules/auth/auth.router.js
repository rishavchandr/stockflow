import {Router} from "express"
import { 
registerUser,
loginUser,
currentUser } from "./auth.controller.js"
import { verifyUser } from "../../middleware/auth.middleware.js"


const router = Router()

router.post('/signup' , registerUser)
router.post('/login' , loginUser)
router.get('/:id' ,verifyUser, currentUser)

export default router