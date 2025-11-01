const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Loads .env variables

const Expense = require('./expense.model');
const Budget = require('./budget.model');

const app = express();
const port = process.env.PORT || 8080;

// --- Middleware ---
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your React app to make requests
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON bodies (like { "amount": 100 })

// --- Database Connection ---
const uri = process.env.DATABASE_URL;

// Check if the URI is loaded
if (!uri) {
  console.error('Error: DATABASE_URL not found in .env file.');
  process.exit(1); // Stop the server
}

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit();
});

// --- Routes ---

// GET all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // Get newest first
    res.json(expenses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADD a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const newExpense = new Expense({
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date() // Use provided date or default to now
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE an existing expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(4404).json({ message: 'Expense not found' });
    }

    const { description, amount, category } = req.body;

    expense.description = description;
    expense.amount = Number(amount);
    expense.category = category;
    // Note: We are not updating the date here, but you could add it.

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an expense
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

// --- Budget Routes ---

// GET the current budget
app.get('/api/budget', async (req, res) => {
  try {
    let budget = await Budget.findOne({ identifier: 'main_budget' });
    if (!budget) {
      // If no budget is set, create one with 0
      budget = new Budget({ amount: 0, identifier: 'main_budget' });
      await budget.save();
    }
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// SET the budget
app.post('/api/budget', async (req, res) => {
  try {
    const { amount } = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { identifier: 'main_budget' },
      { amount: Number(amount) },
      { new: true, upsert: true } // upsert: true creates it if it doesn't exist
    );
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Deployment Setup ---
const BuildclientPath = path.join(__dirname, '../client/dist');
app.use(express.static(BuildclientPath));

// Sends all non-API requests to the React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(BuildclientPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
// -----------------------------

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

