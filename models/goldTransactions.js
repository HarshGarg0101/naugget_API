const mongoose = require('mongoose');

const goldTransactions = mongoose.Schema({
    userId: { type: ObjectId, required: true, ref: 'User' },
    entityUser: {type: String, required: true, ref: 'User'},  
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enums: ['CREDIT', 'DEBIT'] }, 
    status: { type: String, required: true, enums: ['FAILED', 'SUCCESS', 'PROCESSING'],
    runningBalance: { type: Number, required: true },
    createdAt: { type: Date, required: true },   // Created At date
    updatedAt: { type: Date, required: true }   // Updated At date
    }
});

module.exports = mongoose.model('User_info', goldTransactions);


/*The gold transaction schema includes the following fields:
● userId: A required object ID reference to the user.
● entityUser: An object ID reference to the user entity.
● quantity: A required number indicating the quantity of gold in gms.
● amount: A required number indicating the amount spent or earned.
● type: A required string with possible values of "CREDIT" or "DEBIT".
● status: A required string indicating the transaction status, with possible values of "FAILED", "SUCCESS",
"WAITING", "CANCELED", or "PENDING".
● runningBalance: An object with required number fields indicating the wallet, loyalty points, and gold balances.
● createdAt: A required date indicating when the transaction was created.
● updatedAt: A required date indicating when the transaction was last updated.*/