import {Router} from 'express'
import {creatOrder, deliverOrder, initiatePayment, myOrders, paymentWebhook} from "../controllers/order.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const orderRouter = new Router();

orderRouter.post('/createOrder',authMiddleware, creatOrder)
orderRouter.post('/initiatePayment',initiatePayment)
orderRouter.get('/paymentWebhook',paymentWebhook)
orderRouter.get('/myOrders',authMiddleware,myOrders)
orderRouter.post('/deliverOrder',authMiddleware,deliverOrder)

export default orderRouter;