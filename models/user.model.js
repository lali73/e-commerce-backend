import mongoose from 'mongoose'
 const UserSchema = new mongoose.Schema({
     name:{
         type:String,
         required: [true, 'User name is required'],},
     email:{
         type:String,
         required: [true, 'User email is required'],
         unique:true
         ,trim:true,
     minlength:5,
     maxlength:255,
     match:[/\S+@\S+\.\S+/,'Please fill a valid email address']},
     password:{
         type:String,
         required: [true, 'User Password is required'],
     minlength:5,
     maxlength:120,},
     role:{
         type:String,
         enum:['client','admin','vendor'],
         required: [true, 'User role is required'],
     },
     resetToken:{
         type:Number,
         default:null,
     },
     resetTokenExpiry:{
         type: Date,
         default:null
     },
     google:{
         type:Boolean,
         default:false,
     }
 },
{
    timestamps:true
});
const User = mongoose.model('User',UserSchema);

export default User;

