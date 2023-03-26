const express = require('express');
const router = express.Router();
const User = require('../models/user');
const WalletTransaction = require('../models/walletTransaction');
const GoldTransaction = require('../models/goldTransaction');

router.get('/portfolio/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); //find by ID
    const walletTransactions = await WalletTransaction.find({ userId: req.params.userId }); // if user found
    const goldTransactions = await GoldTransaction.find({ userId: req.params.userId }); 
//Additions and subtractions based on CREDIT and DEBIT
    const netFundAdded = walletTransactions.reduce((acc, curr) => {
      return curr.type === 'CREDIT' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const currentFund = user.runningBalance.wallet;

    const netGoldPurchased = goldTransactions.reduce((acc, curr) => {
      return curr.type === 'CREDIT' ? acc + curr.quantity : acc - curr.quantity;
    }, 0);
//Net calcuations & gain loss
    const netGoldAmount = netGoldPurchased * user.runningBalance.goldPrice;

    const netGrowthOrLoss = netFundAdded + netGoldAmount - currentFund;

    const gainOrLossPercentage = ((netGrowthOrLoss / currentFund) * 100).toFixed(2);

    res.json({
      netFundAdded,
      currentFund,
      netGrowthOrLoss,
      gainOrLossPercentage
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;