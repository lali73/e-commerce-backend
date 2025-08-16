import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,},
        description:{type:String,required:true,},
        images:[{url:{type:String,required:true},imageId:{type:String,required:true},}],

        price:{type:Number,required:true,
        min:[0,'Price must be greater than 0'],},

        category:{type:String,required:true,},
        stock:{type:Number,required:true,min:[0,'Stock must be greater than 0'],
        validate:{validator:Number.isInteger,message:'Stock must be an Integer'},},vendorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,},

},{timestamps:true});

const Product = mongoose.model('Products', ProductSchema);

export default Product;