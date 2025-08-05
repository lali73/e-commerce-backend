import mongoose from 'mongoose';
import Product from '../models/product.model.js';


export const createProduct = async(req, res,next) => {
    try {
        const {name, price,  description, category, stock} = req.body;
        const newProduct = await  Product.create({name, price,  description, category, stock, imageUrls: req.files?.map(file => file.path) || []});

        return res.status(201).json({success:true,message:'Product created successfully',products:newProduct});


    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
export const allProducts = async(req, res,next) => {
    try{
        const rawPage =parseInt(req.query.page);
        const rawLimit = parseInt(req.query.limit);

    const page =(!isNaN(rawPage) && rawPage>0) ? rawPage : 1;
    const limit = (!isNaN(rawLimit )&& rawLimit >0 )?Math.min(rawLimit,100):10


        const skip = (page - 1)*limit;
      const [products,total] = await Promise.all([Product.find().sort({createdAt: -1})
          .skip(skip)
          .limit(limit),
        Product.countDocuments()
          ]);


      return res.status(200).json({success:true,products,
      total,
      currentPage: page,
      totalPages:Math.max(Math.ceil(total/limit),1)});

    }
    catch (error){
    next(error);
    }
};
export const singleProduct = async(req, res) => {};
export const updateProduct = async(req, res) => {};
export const deleteProduct = async(req, res) => {};

