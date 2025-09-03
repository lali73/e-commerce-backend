import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import crypto from 'crypto';

export const creatOrder = async (req,res,next)=>{
   try{
       const userId=req.user?.userId;
       const {items} = req.body;

       const random = crypto.randomBytes(4).toString('hex');
       const orderId = `ORD-${Date.now()}-${random}`;
       let amount = 0;
       const ids = items.map(item=>item.productId)
       const products = await Product.find({_id:{$in:ids}})
       for(const item of items) {
           const product = products.find(p=>p._id.toString()===item.productId);
           if(!product){
               return res.status(400).send({message:'Product not found.'});
           }
           item.name = product.name
           item.price = product.price
           item.amount = item.price * item.quantity
           amount += item.amount;
       }

       const gateway = "Chapa"
       const order = await Order.create({userId,items,orderId,gateway,amount})
       res.status(201).json({success:true,message:'Order successfully created',order})

   }
   catch(error){
    next(error)
   }

}