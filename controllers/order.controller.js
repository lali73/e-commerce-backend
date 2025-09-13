import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import crypto from 'crypto';
import {config} from 'dotenv'
import axios from 'axios'
import User from "../models/user.model.js";

config();

export const creatOrder = async (req,res,next)=>{
   try{
       const userId=req.user?.userId;
       const {items,address,phoneNumber} = req.body;

       const isValidPhone = (phoneNumber)=>{
           const regex = /^(?:\+251|0)?(9|7)\d{8}$/;
           return regex.test(phoneNumber);
       }
       if(!isValidPhone(phoneNumber)){
           return res.status(400).send({error:'Phone number is invalid'});
       }
       const random = crypto.randomBytes(4).toString('hex');
       const orderId = `ORD-${Date.now()}-${random}`;
       let totalAmount = 0;
       const ids = items.map(item=>item.productId)
       const products = await Product.find({_id:{$in:ids}})
       for(const item of items) {
           const product = products.find(p=>p._id.toString()===item.productId);
           if(!product){
               return res.status(400).send({message:'Product not found.'});
           }
           item.vendorId=product.vendorId.toString();
           item.name = product.name
           item.price = product.price
           item.amount = item.price * item.quantity
           totalAmount += item.amount;
       }

       const gateway = "Chapa"
       const order = await Order.create({userId,items,orderId,gateway,totalAmount,phoneNumber,address})


       res.status(201).json({success:true,message:'Order successfully created',order})

   }
   catch(error){
    next(error)
   }
}
export const initiatePayment = async (req,res,next)=>{
   try{
       const {orderId} = req.body;
       const order = await Order.findOne({orderId:orderId})
       if(!order){
           return res.status(400).send({message:'Order not found.'});
       }
       const url = "https://api.chapa.co/v1/transaction/initialize"
       const paymentPayload = {
           amount:order?.totalAmount.toString(),
           tx_ref: order.orderId,
           callback_url:"https://e-commerce-backend-lali735628-ghb3g0u6.leapcell.dev/api/v1/order/paymentWebhook",
           currency:"ETB",

           customization:{
               title:"payment for ",
               description:"payment description",
           }
       }
       const headers = {
           "Authorization": `Bearer ${process.env.CHAPA_SECRET_KEY}`,
           "content-type": "application/json",
       }



       const response = await axios.post(url,paymentPayload,{headers:headers})
        const data = response.data
       const checkoutUrl = data.data.checkout_url;
       order.paymentSession = {
           paymentUrl:checkoutUrl,
           txRef:order.orderId,
       };
       await order.save();
       res.status(200).json({success:true,paymentUrl:checkoutUrl});
   }
   catch(error){
       if (error.response) {
           console.error("Chapa error:", error.response.data);
           return res.status(error.response.status).json(error.response.data);
       } else {
           console.error("Error:", error.message);
           next(error);
       }
   }
}
export const paymentWebhook = async (req,res,next)=>{
    try{

        const {trx_ref,status}=req.body;
        const order = await Order.findOne({orderId:trx_ref})
        if(!order){
            return res.status(400).send({message:'Order not found.'});
        }
        if(status==="success"){
        const request =   await axios.get(`https://api.chapa.co/v1/transaction/verify/${trx_ref}`,{headers:{Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`}})
            const verifyData = request.data;
        if (verifyData.status === "success"&&verifyData.data.status === "success"){
            order.status="Paid";
            order.transactionId=verifyData.data.reference
            await order.save();
        }
        else{
            order.status="Failed"
           await order.save();
        }
        }
        res.status(200).json({success:true,message:"Webhook received."});
    }
    catch(error){
        next(error)
    }
}
export const myOrders = async (req,res,next)=>{
    try{
        const userId=req.user?.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).send({message:'User not found.'});
        }
        const result = await Order.aggregate([
            {$unwind:"$items"},
            {$match:{status:"paid"}},
            {$group:{_id:"$items.vendorId",
                    orders:{
                        $push:{
                            orderId:"$orderId",
                            item:"$items"
                        }
                    },
                    totalOrders:{$addToSet:"$_id"},
                    totalSales:{$sum:"$items.quantity"}
                }},
            {$project:{

                    totalOrders:{$size:"$totalOrders"},
                    totalSales:1,
                    orders:1,
                }}
        ])
        res.status(200).json({success:true,message:"your order",result});
    }
    catch(error){
        next(error)
    }
}