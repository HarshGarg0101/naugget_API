const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletTransaction = mongoose.Schema({
    userId: { type: ObjectId, required: true, ref: 'User' }, // To store the user id
    amount: { type: Number, required: true }, // Amount of the transaction done.
    type: { type: String, required: true, enums: ['CREDIT', 'DEBIT'] }, // Type - debit or credit.
    status: {
    type: String,
    required: true,
    enums: ['FAILED', 'SUCCESS', 'PROCESSING'],
    }, // Status of the transaction being done.
    runningBalance: { type: Number, required: true }, // Running Balance of the user after each
    transaction: { type: ObjectId, ref: 'Transaction' }, // Gold transactions reference.
    createdAt: { type: Date, required: true },   // Created At date
    updatedAt: { type: Date, required: true }   // Updated At date
    
});

module.exports = mongoose.model('Wallet_trans', WalletTransaction);