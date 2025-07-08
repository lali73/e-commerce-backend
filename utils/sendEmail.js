import nodemailer from 'nodemailer';
import {config} from 'dotenv';

config();

export const sendEmail = async (email,subject,text,html) => {

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: true,
          auth: {
              user:process.env.EMAIL,
              pass:process.env.EMAIL_PASS,
          },
      });

      const mailOptions = {
          from: process.env.EMAIL,
          to:email,
           subject,
           text,
           html,
      }

      try{
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent"+info.response);
          return info;
      }
      catch(error){
          console.error('Error sending email',error);
          throw error;

      }}


