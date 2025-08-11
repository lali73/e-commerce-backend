import mongoose from 'mongoose';
import Product from '../models/product.model.js';


export const createProduct = async(req, res,next) => {
    try {
        const {name, price,  description, category, stock} = req.body;
        const vendorId = req.user.id;
        const newProduct = await  Product.create({name,vendorId, price,  description, category, stock, imageUrls: req.files?.map(file => file.path) || []});

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
    const limit = (!isNaN(rawLimit )&& rawLimit >0 )?Math.min(rawLimit,100):50


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
export const singleProduct = async(req, res,next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({success:false,message:'Product not found' });
        }
        return res.json({success:true,message:'Product found',product});
    }
    catch (error) {
        next(error);
    }

};
export const myProducts = async(req, res,next) => {
    const vendorId = req.user.id;
    const products = Product.findOne(vendorId)
}
/*export const updateProduct = async(req, res, next) => {
    try{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({success:false,message:'Product not found'});
    }

    const allowedFields = ['name','price','description','category','stock','imageUrls'];
    const keys = Object.keys(req.body);
    if(keys.length === 0){
        return res.status(400).json({success:false,message:'No fields to update'})
    }

    for(const key of keys){
        if(!allowedFields.includes(key)){
            return res.status(400).json({success:false,message:'Invalid Key'})
        }
        product[key] = req.body[key];
    }
    await product.save()


    res.status(200).json({success:true,message:'Product updated',product});





    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async(req, res,next) => {
    const productId = req.params.id;

};
*/
