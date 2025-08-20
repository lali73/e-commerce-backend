import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        default:0,
        min:1,
        max:5

    },
    review:{
        type:String,
    }

})
const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
