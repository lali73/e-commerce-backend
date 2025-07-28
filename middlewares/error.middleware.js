const errorMiddleware = (err, req, res, next) => {


    console.error(err);
    let message  = err.message||'Internal Server Error';
    let statusCode = err.statusCode|| 500;

    if(err.name==='CastError'){
        message = 'Resource not found';
        statusCode = 404;
    }
    if(err.code===11000){
        message = ' Duplicate field value entered';
        statusCode = 400;
    }
    if(err.name==='ValidationError'){
        message = Object.values(err.errors).map(val=> val.message).join(', ');
        statusCode = 400;
    }
    res.status(statusCode).json({success: false, message: message||'server error'});


}
export default errorMiddleware;