import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN,JWT_SECRET} from "../config/env.js";
import {sendEmail} from "../utils/sendEmail.js";
import{OAuth2Client} from "google-auth-library";
import crypto from "crypto"



export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {name, email, password,role} = req.body;

            const existingUser = await User.findOne({email});

            if (existingUser) {
                const error = new Error('User already exists');
                error.statusCode = 409;
                throw error;
            }

            const salt= await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(password, salt);


            const newUsers = await User.create([{name, email,  password:hashedPassword,role}],{session, ordered:true});

            const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});



            await session.commitTransaction();
            session.endSession();
            return res.status(201).json({success: true, message:'User created successfully',
                data:{token,
                    user:newUsers[0],
                }});




        
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}
export const signIn = async (req, res, next) => {
try {
    const {email, password} = req.body;
    const user = await User.findOne({email});


    if (!user) {
       const error = new Error('User not found');
       error.statusCode = 404;
       throw error;
    }


    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) {
        const error = new Error('invalid Password');
        error.statusCode = 401;
        throw error;
    }


 const token = jwt.sign({userId:user._id,role:user.role,name:user.name}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
 //const {password: _,...userWithoutPassword}=user._doc;

    res.status(200).json({success:true,
    message:'User signed in successfully',
    token,
        user:{
        id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,


        },


    });

}
catch (error) {
  next(error)
}
}
export const forgetPassword = async (req, res, next) => {
   try{
       const {email} =req.body;
       const user = await User.findOne({email})
       if (!user) {
           const error = new Error('User not found');
           throw error;
       }


       const otp = Math.floor(100000+Math.random()*900000);
       const resetTokenExpiry = Date.now() + 1000*60*15;
       user.resetToken= otp;
       user.resetTokenExpiry = resetTokenExpiry;
       await user.save();


       const token = crypto.randomBytes(16).toString('hex');

       const resetLink = `https://elst-e-commerce.vercel.app/auth/resetPassword?token=${token}`;



       await sendEmail(email,
           'Reset Your Password',
           `This is your secret code do not share it with anyone ${otp}`,
           `
<h1>This is your secret code do not share it with anyone ${otp}</h1>
<h1>Click<a href="${resetLink}">here</a> to reset your password. </h1>`);


        res.status(200).json({success:true,
        message:'Email sent successfully',})


       

   }
   catch (error) {
       next(error);
   }

}
export const resetPassword = async (req, res, next) => {
    const {otp,newPassword} = req.body;
   try {
       const user = await User.findOne({
           resetToken: otp,
           resetTokenExpiry: {$gt: Date.now()},
       });
       if (!user) {
           return res.status(400).json({success: false,message: 'Invalid or expired otp'},


       )}
       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(newPassword, salt);

       user.password = hashPassword;
       user.resetToken = undefined;
       user.resetTokenExpiry = undefined;

       await user.save();
       res.status(200).json({
           success: true,
           message: 'Password reset successfully',
       });

   }
   catch (error) {
       next(error);
   }
}
export const googleAuth = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const {token:idToken}=req.body;
    const client = new OAuth2Client(process.env.CLIENT_ID);
     try {
         const ticket = await client.verifyIdToken({
             idToken,
             audience : process.env.CLIENT_ID,
         });
         const payload = ticket.getPayload();
         const{email,name} = payload;

         const  existingUser = await User.findOne({email})
         if(existingUser&&!existingUser.google) {
             const error = new Error('you registerd using a password. Please log in with email and password');
             throw error;
         }
         else if (existingUser&&existingUser.google){
             const token = jwt.sign({userId: existingUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
             session.endSession()
             return res.status(200).json({
                 success:true,
                 message:'User signed-ind successfully',
                 data:{token,
                 user:existingUser,}
                })

         }
         const newUsers = await  User.create([{
             name,
             email,
             google:true}],{session});
         const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

         res.status(200).json({
             success:true,
             message:'User signed-up successfully',
             data:{token,
                 user:newUsers[0],}
         });
         session.commitTransaction();
         session.endSession();







     }
     catch (error) {
         session.abortTransaction();
         session.endSession();
         next(error);
     }
}