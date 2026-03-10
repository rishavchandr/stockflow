import { Router } from "express";
import { getDashboard } from "./dashboard.controller.js";
import { verifyUser } from "../../middleware/auth.middleware.js";

const dashBoardRouter = Router()

dashBoardRouter.get('/' , verifyUser , getDashboard)

export default dashBoardRouter