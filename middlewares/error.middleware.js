const errorMiddleware = (err, req, res, next) => {
    try{
    let error = {...err};
    error.message = err.message;
    console.error (err);

    if(err.name==='CastError'){
        const message = 'Resource not found';
        error = new Error(error.message);
        error.statusCode = 404;
    }
        if(err.name==='11000'){
            const message = ' Duplicate field value entered';
            error = new Error(error.message);
            error.statusCode = 400;
        }
        if(err.name==='ValidationError'){
            const message = Object.values(err.errors).map(val=> val.message);
            error = new Error(error.message);
            error.statusCode = 404;
        }
    res.status(err.statusCode || 500).json({success:false, message:error.message || 'server error'});
    }
    catch(error){
    next(error);
    }
}

export default errorMiddleware;