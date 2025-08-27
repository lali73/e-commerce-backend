import {Router} from 'express';
import {addToCart, updateCart} from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const cartRoutes = Router();

cartRoutes.post('/addToCart',authMiddleware,addToCart)
cartRoutes.patch('/updateCart',authMiddleware,updateCart)

export default cartRoutes;