const BaseRepository = require('./baseRepository');
const Payment = require('../models/payment');
const CustomError = require('../util/customError');


class PaymentRepository extends BaseRepository {

    constructor(model){
        super(Payment);
    }

    async createPayment(paymentData){
        try {
            const payment = await this.create(paymentData);
            return payment;
        } catch (error) {
                return new CustomError(`Error in creating ${error.message}`);
        }
    }

    async getPaymentsByUser(userId) {
        try {
            return await this.model.find({ user: userId });
        } catch (error) {
            throw new CustomError(`Error fetching payments for user ${userId}, ${error.message}`);
        }
    }

    async getOverduePayments() {
        try {
            const currentDate = new Date();
            const overduePayments = await this.model.find({nextPaymentDate: {$lt: currentDate}}).populate('user');
        } catch (error) {
            throw new CustomError(`Error fetching overdue payments ${error}`);
        }
    }
}

module.exports = PaymentRepository;