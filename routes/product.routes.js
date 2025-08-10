import {Router} from 'express';
import{allProducts,createProduct,singleProduct,} from "../controllers/product.controller.js";
import upload from '../utils/multer.js'
import authMiddleware from "../middlewares/auth.middleware.js";


const productRouter = Router();

productRouter.post('/createProduct',authMiddleware,upload.array('images',5),createProduct)
productRouter.get('/allProducts',allProducts)
productRouter.get('/singleProduct/:id',singleProduct)
// productRouter.patch('/updateProduct/:id',authMiddleware,updateProduct)
// productRouter.delete('/deleteProduct/:id',authMiddlewaer,deleteProduct)

export default productRouter;