const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  amount: { type: Number, required: true, default: 0 },
  // This identifier ensures we only ever have one budget document
  identifier: { type: String, default: 'main_budget', unique: true }
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

