import multer from "multer";
// loads storage engine it decides where and how file is stored
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from './cloudinary.js'

const storage = new CloudinaryStorage({
    // binds the storage engine to the cloudinary instance
    cloudinary: cloudinary,
    params:{
        folder:'e-commerce/products',
        allowed_formats:['jpg','png','jpeg'],
    }
});





const upload = multer({storage});
export default upload;