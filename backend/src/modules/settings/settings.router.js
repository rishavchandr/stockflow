import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller.js";
import { verifyUser } from "../../middleware/auth.middleware.js";

const settingsRouter = Router()

settingsRouter.put('/', verifyUser , updateSettings)
settingsRouter.get('/' , verifyUser, getSettings)

export default settingsRouter
