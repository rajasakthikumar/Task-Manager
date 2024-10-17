const BaseService = require('./baseService');
const CustomError = require('../util/customError');

class PaymentService extends BaseService {
    constructor(paymentRepository, userService) {
        super(paymentRepository);
        this.userService = userService;
    }

    async getUserPayments(userId) {
        return await this.repository.getPaymentsByUser(userId);
    }

    async createPayment(paymentData, userId) {
        const user = await this.userService.getUserById(userId);
        if (!user) throw new CustomError('User not found', 404);
        paymentData.user = userId;
        const payment = await this.repository.createPayment(paymentData);
        return payment;
    }


    async getOverduePayments() {
        const payments = await this.repository.getOverduePayments();
        const userIds = payments.map(payment => payment.user._id.toString);
        const uniqueUsers = [...new Set(userIds)];
        const users = await this.userService.getUsersById(uniqueUsers);
        return users;
    }
    
}

module.exports = PaymentService;
