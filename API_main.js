const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const WalletTransaction = require('../models/walletTransaction');
const GoldTransaction = require('../models/goldTransaction');
const { JWT_SECRET } = require('../config'); // Replace with your own secret key

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Authentication failed: No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

router.get('/portfolio/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const walletTransactions = await WalletTransaction.find({ userId: req.params.userId });
    const goldTransactions = await GoldTransaction.find({ userId: req.params.userId });

    const netFundAdded = walletTransactions.reduce((acc, curr) => {
      return curr.type === 'CREDIT' ? acc + curr.amount : acc - curr.amount;
    }, 0);

    const currentFund = user.runningBalance.wallet;

    const netGoldPurchased = goldTransactions.reduce((acc, curr) => {
      return curr.type === 'CREDIT' ? acc + curr.quantity : acc - curr.quantity;
    }, 0);

    const netGoldAmount = netGoldPurchased * user.runningBalance.goldPrice;

    const netGrowthOrLoss = netFundAdded + netGoldAmount - currentFund;

    const gainOrLossPercentage = ((netGrowthOrLoss / currentFund) * 100).toFixed(2);

    res.json({
      netFundAdded,
      currentFund,
      netGrowthOrLoss,
      gainOrLossPercentage,
      goldWeight: user.runningBalance.goldWeight
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
