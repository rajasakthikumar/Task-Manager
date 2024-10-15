class CustomError extends Error {
    constructor(message, statusCode) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super(message); 
        this.statusCode = statusCode;
        this.name = 'CustomError'; 
    }

    static handleError(err, res) {
        const status = err.statusCode || 500;
        const responseMessage = err.message || 'An error occurred';
        res.status(status).json({
            success: false,
            message: responseMessage,
        });
    }
}

module.exports = CustomError; 