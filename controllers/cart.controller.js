import Cart from '../models/cart.model.js'



export const addToCart = async(req, res,next) => {
    try{
        const userId = req.user?.userId;
        const {products}= req.body;
        const usersCart = await Cart.findOne({userId:userId});
        if(usersCart){
            products.forEach((product)=> {
                const {productId, quantity} = product;
                const existingProduct = usersCart.products.find(p=>p.productId.toString() === productId);
                if(existingProduct){
                    existingProduct.quantity +=quantity;
                }
                else{
                    usersCart.products.push(product);
                }

            })

            usersCart.totalItems = usersCart.products.reduce((acc,cur)=>acc+=cur.quantity,0) ;
            await usersCart.save();
            return res.status(200).json({success:true,message:' added to cart successfully',usersCart});


        }
        const totalItems = products.reduce((acc,cur)=>acc+=cur.quantity,0) ;
        const cart = await Cart.create({userId,products,totalItems})

        res.status(201).json({success:true,message:'cart created successfully',cart});
    }
    catch(error){
        next(error)
    }

}
export const updateCart = async(req, res,next) => {
    try{
        const userId=req.user?.userId;
        const {products} = req.body;
        const usersCart = await Cart.findOne({userId:userId});
        if(!usersCart){
            return res.status(404).json({success:false,message:'no cart found'});
        }
        usersCart.products = products;

        usersCart.totalItems = usersCart.products.reduce((acc,cur)=>acc+=cur.quantity,0)
        await usersCart.save();
        res.status(200).json({success:true,message:' updated cart successfully',usersCart});
    }
    catch(error){
        next(error)
    }
}