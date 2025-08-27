import mongoose from 'mongoose'

const Cart = mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,},
    productId:[{type:mongoose.Types.ObjectId,ref:'Product',required:true},]
});

const cartModel = mongoose.model('Cart', Cart);

export default cartModel;