//import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Rating from '../models/rating.model.js';
import cloudinary from 'cloudinary';


export const createProduct = async(req, res,next) => {
    try {
        const {name, price,  description, category, stock} = req.body;
        const vendorId = req.user.userId;
        const images = req.files.map(file =>({imageUrl:file.path,
        imageId:file.filename}))

        const newProduct = await  Product.create({name,vendorId, price,  description, category, stock,images:images || []});

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
        const rating = await Rating.find({productId:productId});
        if (!product) {
            return res.status(404).json({success:false,message:'Product not found' });
        }
        return res.json({success:true,message:'Product found',product,rating});
    }
    catch (error) {
        next(error);
    }

};
export const myProducts = async(req, res,next) => {
   try {
       const vendorId = req.user.userId;
       const products = await Product.find({vendorId});
       if (products.length ===0) {
           return res.status(404).json({success:false,message:'Product not found'});
       }

       return res.json({success:true,message:'Product found',products:products});
   }
   catch (error) {
       next(error);
   }};


export const updateProduct = async(req, res, next) => {
    try{
        // check if the vendor is the owner of the product
        const vendorId = req.user.userId;
        const productId = req.params.id;
        const product = await Product.findOne({_id:productId,vendorId:vendorId},{}, null);


        if (!product) {
        return res.status(404).json({success:false,message:'Product not found'});
        }
        const updateFile = {...req.body}

// specify what kind of fields can be updated
    const allowedFields = ['name','price','description','category','stock','images'];

// check if the requested field is one of the allowed fields and exists
    const keys = Object.keys(updateFile);
    if(keys.length === 0){
        return res.status(400).json({success:false,message:'No fields to update'})
    }

    for(const key of keys){
        if(!allowedFields.includes(key)){
            return res.status(400).json({success:false,message:'Invalid Key'})
        }}
//if it is the image delete the old one and replace with new
let newImages;

    if(req.files && req.files.length > 0){
        for (const img of product.images){
            await cloudinary.uploader.destroy(img.imageId);

        }
         newImages = req.files.map((file)=>({
             imageUrl:  file.path,
             imageId : file.filename,




        }))
    }

if(newImages) {
    updateFile.images = newImages;
}
        //update the product



    const updatedProduct = await Product.findByIdAndUpdate(productId,updateFile, {new:true})




    res.status(200).json({success:true,message:'Product updated',updatedProduct});





    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async(req, res,next) => {
    try {
        const vendorId = req.user.userId;
        const productId = req.params.id;
        const product = await Product.findOne({_id:productId,vendorId:vendorId})

        if (!product) {
            return res.status(404).json({success:false,message:'Product not found'});
        }

       await product.deleteOne();


        return res.status(200).json({success:true,message:'Product deleted successfully'});


    }
    catch (error) {
        next(error);
    }

};
export const rating = async(req, res,next) => {
        //verify user and product exists
try{
    const productId = req.params.id;
    const {userId,name} = req.user;
    const {rating,review} = req.body
    const product = await Product.findOne({_id:productId})

if(!product||!userId){
        return res.status(404).json({success:false,message:"product not found or Invalid user"})
}

const existingRating = await Rating.findOne({productId:productId,userId:userId})

if(rating<1||rating>5){
    return res.status(400).json({success:false,message:'rating must be b/n 1 and 5'})
    }

    if (existingRating) {
        const oldRating = existingRating.rating
        existingRating.rating = rating||existingRating.rating||0;
        existingRating.review = review||existingRating.review||"";
        await existingRating.save()
        if(product.totalRating===0){
            product.averageRating=rating;
        }
        else{
        product.averageRating = ((product.averageRating*product.totalRating)-oldRating+rating)/(product.totalRating);}
        await product.save({validateBeforeSave:false})
        return res.status(200).json({success:true,message:'Product rating successfully',rating:existingRating,product});
    }
    const newRating =await Rating.create({rating,review,productId,userId,name})
    product.averageRating = ((product.averageRating * product.totalRating)+rating)/(product.totalRating+1);
    product.totalRating +=1;
    await product.save({validateBeforeSave:false});


    res.status(201).json({success:true,message:'Product rating successful',rating:newRating,product});
}
catch (error){
    next(error)
}
}


