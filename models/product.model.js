import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name:{type:String,required:true,},
        description:{type:String,required:true,},
        images:[{
                imageUrl:{type:String,required:true},imageId:{type:String,required:true},}],

        price:{type:Number,required:true,
        min:[0,'Price must be greater than 0'],},

        category:{type:String,required:true,},
        stock:{type:Number,required:true,min:[0,'Stock must be greater than 0'],
        validate:{validator:Number.isInteger,message:'Stock must be an Integer'},},
        vendorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,},
        totalRating:{type:Number,default:0,},
        averageRating:{type:Number, default:0,min:1,max:5}

},{timestamps:true});

const Product = mongoose.model('Products', ProductSchema);

export default Product;