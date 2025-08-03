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
export const deleteProduct = async(req, res) => {};
export const updateProduct = async(req, res) => {};
export const allProducts = async(req, res) => {};
export const singleProduct = async(req, res) => {};

