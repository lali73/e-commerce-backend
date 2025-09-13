import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true,
        unique: true,
    },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    address:{type:String,},
    phoneNumber:{type:Number,},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
            vendorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,},
            name: {type: String, required: true},
            quantity: {type: Number, required: true,min:1},
            price:{type:Number, required: true},
            amount:{type:Number, required: true},
        }],
    vendorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,},
    totalAmount:{type:Number,required:true,},
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

const Order = mongoose.model('Order', OrderSchema);

export default Order;