import {Router} from 'express';
import {
 allProducts,
 createProduct,
 myProducts,
 singleProduct,
 updateProduct,
 deleteProduct,
 rating,
} from "../controllers/product.controller.js";
import upload from '../utils/multer.js'
import authMiddleware from "../middlewares/auth.middleware.js";


const productRouter = Router();

productRouter.post('/createProduct',authMiddleware,upload.array('images',5),createProduct)
productRouter.get('/allProducts',allProducts)
productRouter.get('/singleProduct/:id',singleProduct)
productRouter.get('/myProducts',authMiddleware,myProducts)
 productRouter.patch('/updateProduct/:id',authMiddleware,upload.array("images",5),updateProduct)
 productRouter.delete('/deleteProduct/:id',authMiddleware,deleteProduct)
productRouter.post('/rating/:id',authMiddleware,rating)


export default productRouter;