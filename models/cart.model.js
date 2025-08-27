import mongoose from 'mongoose'

const Cart = mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,},
    products:[
        {productId:{type:mongoose.Types.ObjectId, ref:'Product',required:true},
        quantity:{type:Number, required:true,min:1, },}
    ],
    totalItems:{type:Number,default:0},
});

const cartModel = mongoose.model('Cart', Cart);

export default cartModel;