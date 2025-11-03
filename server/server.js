const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Expense = require('./expense.model');
const Budget = require('./budget.model');

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL, // We'll set this in Vercel
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// --- Database Connection ---
const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error('Error: DATABASE_URL not found in .env file.');
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit();
});

// --- Routes ---

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const newExpense = new Expense({
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date()
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          description: req.body.description,
          amount: req.body.amount,
          category: req.body.category,
        },
      },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ id: req.params.id, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/budget', async (req, res) => {
  try {
    let budget = await Budget.findOne({ identifier: 'main_budget' });
    if (!budget) {
      budget = new Budget({ amount: 0, identifier: 'main_budget' });
      await budget.save();
    }
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/budget', async (req, res) => {
  try {
    const { amount } = req.body;
    const updatedBudget = await Budget.findOneAndUpdate(
      { identifier: 'main_budget' },
      { amount: Number(amount) },
      { new: true, upsert: true }
    );
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// Export for Vercel serverless
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}