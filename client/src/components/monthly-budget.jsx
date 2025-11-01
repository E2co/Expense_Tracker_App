"use client"

import { useState, useEffect } from "react"
import axios from "axios" // Import axios for API calls

// Define the API URL for the budget endpoint
const API_URL = "/api/budget"

function MonthlyBudget({ expenses }) {
  const [budget, setBudget] = useState(0)
  const [budgetInput, setBudgetInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiAlert, setApiAlert] = useState(null)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // --- API Fetch Logic ---
  const fetchBudget = async () => {
    setLoading(true)
    setApiAlert(null)
    try {
      const response = await axios.get(API_URL)
      const amount = response.data.amount || 0
      setBudget(amount)
      setBudgetInput(amount > 0 ? amount.toString() : "") // Keep input synced
      setError(null)
    } catch (err) {
      console.error("Error fetching budget:", err)
      setApiAlert({ type: "danger", message: 'Failed to load budget from server.' })
      setBudget(0)
    } finally {
      setLoading(false)
    }
  }

  // Load budget from API on mount
  useEffect(() => {
    fetchBudget()
  }, [])

  // --- Calculations ---
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })

  const spent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = budget - spent
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0

  // --- API Set Logic ---
  const handleSetBudget = async () => {
    const newBudget = Number.parseFloat(budgetInput)
    if (newBudget >= 0) {
      try {
        setLoading(true)
        // POST request to the backend to update/set the budget
        const response = await axios.post(API_URL, { amount: newBudget })

        // Update local state with the saved value
        setBudget(response.data.amount)
        setBudgetInput(response.data.amount.toString())
        setError(null)
      } catch (err) {
        console.error("Error setting budget:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  const getProgressClass = () => {
    if (percentage >= 100) return "danger"
    if (percentage >= 75) return "warning"
    return "success"
  }

  const alert = (() => {
    if (remaining < 0) {
      return { type: "danger", message: `You've exceeded your budget by $${Math.abs(remaining).toFixed(2)}!` }
    }
    if (remaining > 0 && percentage >= 75) {
      return { type: "warning", message: `You have spent ${percentage.toFixed(0)}% of your budget. Be careful!` }
    }
    return null
  })()

  if (loading) {
      return <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>Loading Budget...</div>
  }
  
  if (error) {
    return <div className="budget-alert danger">{error}</div>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Monthly Budget</h2>

      <div className="budget-input-group">
        <input
          type="number"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
          placeholder="Set monthly budget"
          step="0.01"
          min="0"
        />
        <button onClick={handleSetBudget} className="btn btn-primary" disabled={loading}>
          Set
        </button>
      </div>

      {budget > 0 && (
        <>
          <div className="budget-progress">
            <div className="budget-progress-bar">
              <div className={`budget-progress-fill ${getProgressClass()}`} style={{ width: `${percentage}%` }}>
                {percentage > 10 && `${percentage.toFixed(0)}%`}
              </div>
            </div>
          </div>

          <div className="budget-info">
            <span>Spent: ${spent.toFixed(2)}</span>
            <span>Budget: ${budget.toFixed(2)}</span>
          </div>

          <div className="budget-info" style={{ marginTop: "8px" }}>
            <span style={{ fontWeight: 600, color: remaining >= 0 ? "#10b981" : "#ef4444" }}>
              Remaining: ${remaining.toFixed(2)}
            </span>
          </div>

          {alert && <div className={`budget-alert ${alert.type}`}>{alert.message}</div>}
        </>
      )}

      {budget === 0 && (
        <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
          <p style={{ marginBottom: "10px" }}>No budget set for this month.</p>
          <p>Please enter an amount above to begin tracking your budget!</p>
        </div>
      )}
    </div>
  )
}

export default MonthlyBudget

