import Order from '../models/order.model.js'
import crypto from 'crypto';

export const creatOrder = async (req,res,next)=>{
   try{
       const userId=req.user?.userId;
       const {items} = req.body;

       const random = crypto.randomBytes(4).toString('hex');
       const orderId = `ORD-${Date.now()}-${random}`;
       let amount = 0;
       items.forEach(item=>{
           item.amount = item.price*item.quantity
           amount += item.amount;
       })
       const gateway = "Chapa"
       const order = await Order.create({userId,items,orderId,gateway,amount})
       res.status(201).json({success:true,message:'Order successfully created',order})

   }
   catch(error){
    next(error)
   }

}