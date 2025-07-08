import express from 'express';
import cookieParser from 'cookie-parser';
import {PORT} from './config/env.js'
import authRouter from './routes/auth.routes.js'
import connectToDatabase from "./database/mogodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";


const app = express();

app.use(cors({
  origin: ['https://elst-e-commerce.vercel.app',
    'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use('/api/v1/auth', authRouter);
app.use(errorMiddleware);

  app.get('/',(req,res)=>{
    res.send('WELCOME TO THE BACKEND OF THIS E-COMMERCE APP')
  });

  app.listen(PORT,async ()=>{
    console.log(`server running on port ${PORT}`);
    await connectToDatabase()
  })
