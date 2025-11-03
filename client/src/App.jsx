"use client"

import { useState, useEffect } from "react"
import axios from "axios" // Import axios
import "./App.css"
import ExpenseForm from "./components/expense-form"
import ExpenseList from "./components/expense-list"
import ExpenseSummary from "./components/expense-summary"
import MonthlyBudget from "./components/monthly-budget" 

// const API_BASE_URL = "http://localhost:8080/api"
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [expenses, setExpenses] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // --- CRUD Operations connected to API ---

  // 1. Fetch Expenses from API on mount
  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
        const response = await axios.get(`${API_BASE_URL}/api/expenses`)
        setExpenses(response.data)
        setError(null)
    } catch (err) {
        console.error("Error fetching expenses:", err)
        setError("Failed to load expenses. Please ensure the server is running.")
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    // Replace localStorage load with API call
    fetchExpenses() 
  }, [])

  // 2. Add Expense via API
  const addExpense = async (expense) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/expenses`, {
          ...expense,
          date: new Date().toISOString()
        })
        setExpenses([response.data, ...expenses])
        setError(null)
    } catch (err) {
        console.error("Error adding expense:", err)
        setError("Failed to add expense.")
    }
  }

  // 3. Update Expense via API
  const updateExpense = async (updatedExpense) => {
    try {
        // Use the MongoDB '_id' for the update endpoint
        const idToUpdate = updatedExpense._id; 
        
        const response = await axios.put(`${API_BASE_URL}/api/expenses/${idToUpdate}`, updatedExpense)
        
        // Update local state by replacing the old document with the new one
        setExpenses(expenses.map((expense) => (expense._id === idToUpdate ? response.data : expense)))
        setEditingExpense(null)
        setError(null)
    } catch (err) {
        console.error("Error updating expense:", err)
        setError("Failed to update expense.")
    }
  }

  // 4. Delete Expense via API
  const deleteExpense = async (id) => {
    try {
        // Use the MongoDB _id for deletion
        await axios.delete(`${API_BASE_URL}/api/expenses/${id}`)
        setExpenses(expenses.filter((expense) => expense._id !== id))
        setError(null)
    } catch (err) {
        console.error("Error deleting expense:", err)
        setError("Failed to delete expense.")
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Amount", "Category"]
    const rows = expenses.map((expense) => [
      // Since the date is now an ISO string from MongoDB, make sure to parse it
      new Date(expense.date).toLocaleDateString(), 
      expense.description,
      expense.amount,
      expense.category,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
  
  if (isLoading) {
    return (
      <div className="app-container" style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <h1 style={{fontSize: '2rem'}}>Loading Expense Data...</h1>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Manage your expenses and stay on budget</p>
      </header>
      
      {error && <div style={{padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>{error}</div>}

      <div className="main-content">
        <div className="card">
          <ExpenseForm
            onSubmit={editingExpense ? updateExpense : addExpense}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>

        <div className="card">
          <MonthlyBudget expenses={expenses} />
        </div>

        <div className="card card-full">
          <ExpenseSummary expenses={expenses} onExport={exportToCSV} />
        </div>

        <div className="card card-full">
          <ExpenseList 
            // Expenses now use the MongoDB '_id'
            expenses={expenses} 
            onEdit={setEditingExpense} 
            onDelete={deleteExpense} 
          />
        </div>
      </div>
    </div>
  )
}

export default App

