const BaseService = require('./baseService');
const CustomError = require('../util/customError');

class PaymentService extends BaseService {
    constructor(paymentRepository, userRepository) {
        super(paymentRepository);
        this.userRepository = userRepository;
    }

    async getUserPayments(userId) {
        return await this.repository.getPaymentsByUser(userId);
    }

    async createPayment(paymentData, userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new CustomError('User not found', 404);
        paymentData.user = userId;
        const payment = await this.repository.createPayment(paymentData);
        return payment;
    }


    async getOverduePayments() {
        const payments = await this.repository.getOverduePayments();
        const userIds = payments.map(payment => payment.user._id.toString);
        const uniqueUsers = [...new Set(userIds)];
        const users = await this.userRepository.findUserByIds(uniqueUsers);
        return users;
    }
    
}

module.exports = PaymentService;
