const asyncHandler = require('../middleware/asynchandler');

class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    getUserPayments = asyncHandler(async (req, res) => {
        const payments = await this.paymentService.getUserPayments(req.user._id);
        res.status(200).json(payments);
    });

    createPayment = asyncHandler(async (req, res) => {
        const paymentData = req.body;
        const payment = await this.paymentService.createPayment(paymentData, req.user._id);
        res.status(201).json(payment);
    });


}

module.exports = PaymentController;