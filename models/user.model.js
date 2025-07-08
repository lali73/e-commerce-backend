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
     resetToken:{
         type:String,
         default:null,
     },
     resetTokenExpiry:{
         type: Date,
         default:null
     },
 },
{
    timestamps:true
});
const User = mongoose.model('User',UserSchema);

export default User;

