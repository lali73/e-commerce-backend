import {Router} from 'express'
import {creatOrder} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = new Router();

orderRouter.post('/createOrder',authMiddleware,creatOrder)

export default orderRouter;