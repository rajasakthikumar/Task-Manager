const CustomError = require("../util/customError");

const errorHandler = (err,req,res,next) => {
    console.error('Error:' ,err);

    if(err instanceof CustomError) {
        return CustomError.handleError(err,res);
    }

    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
}

module.exports = errorHandler;