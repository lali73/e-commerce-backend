import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN,JWT_SECRET} from "../config/env.js";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";



export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt= await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);


        const newUsers = await User.create([{name, email,  password:hashedPassword}],{session});

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

 const token = jwt.sign({userId:user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    res.status(200).json({success:true,
    message:'User signed in successfully',
    data:{token,
        user}});

}
catch (error) {
  next(error)
}
}
export const forgetPassword = async (req, res, next) => {
   try{
       const {email} =req.body;
       const user = await User.findOne({email})
       if (!email) {
           const error = new Error('User not found');
           throw error;
       }

       const token = crypto.randomBytes(32).toString('hex');
       const resetTokenExpiry = Date.now() + 1000*60*15;
       user.resetToken= token;
       user.resetTokenExpiry = resetTokenExpiry;
       await user.save();

       const resetLink = `ask dagim?token=${token}`;



       await sendEmail(email,
           'Reset Your Password',
           'Click here to reset your password',
           `<p>Click<a href="${resetLink}">here</a> to reset your password.</p>`);



       

   }
   catch (error) {
       next(error);
   }

}
export const resetPassword = async (req, res, next) => {
    const {token,newPassword} = req.body;
   try {
       const user = await User.findOne({
           resetToken: token,
           resetTokenExpiry: {$gt: Date.now()},
       });
       if (!user) {
           res.status(400).json({success: false,message: 'Invalid or expired token'},

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
