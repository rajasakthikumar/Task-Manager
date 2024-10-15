const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    tier:{
        type: String,
        required: true ,

    },amount:{
        type: Number,
        required: true
    },
    paymentDate:{
        type: Date,
        default: Date.now
    },
    nextPaymentDate:{
        type: Date,
        required: true,
    },
    paymentType:{
        type: String,
        required: true,
        enum:["credit","debit"],
        default: "credit"
    }
});

module.exports = mongoose.model('Payment', paymentSchema)