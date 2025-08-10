import {Router} from 'express';
import{allProducts,createProduct,singleProduct,updateProduct,deleteProduct} from "../controllers/product.controller.js";
import upload from '../utils/multer.js'


const productRouter = Router();

productRouter.post('/createProduct',upload.array('images',5),createProduct)
productRouter.get('/allProducts',allProducts)
productRouter.get('/singleProduct/:id',singleProduct)
productRouter.patch('/updateProduct/:id',updateProduct)
productRouter.delete('/deleteProduct/:id',deleteProduct)

export default productRouter;