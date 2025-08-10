import jwt from "jsonwebtoken";
import {config} from "dotenv";

config();

const authMiddleware =(req,res,next)=>{
    try{
        const header = req.headers.authorization;

        if(!header || !header.startsWith('Bearer ')){
            return res.status(401).json({success: false, message: 'Unauthorized'});
        }
       const headerArray = header.split(" ")
        const token = headerArray[1]



        req.user = jwt.verify(token, process.env.JWT_SECRET)
       next();
    }
    catch(error){
        next(error);
    }
}
export default authMiddleware;