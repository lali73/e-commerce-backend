import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true,
        unique: true,
    },
    userId:{
        type: String,
        required: true,
    },
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
            name: {type: String, required: true},
            quantity: {type: Number, required: true,min:1},
            price:{type:Number, required: true},
            amount:{type:Number, required: true},
        }],
    amount:{type:Number,required:true,},
    status:{
        type:String,
        enum:["Pending","Paid","Failed"],
        default:"Pending"
    },
    paymentSession:{
        paymentUrl:{type:String,},
        txRef:{type:String,},
        qrCode:{type:String},
    },
    transactionId:{
        type:String,
    },
    gateway:{type:String,required:true,},


},{timestamps:true});