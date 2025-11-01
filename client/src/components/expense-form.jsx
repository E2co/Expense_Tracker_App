"use client"

import { useState, useEffect } from "react"

const CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Healthcare", "Shopping", "Other"]

const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Utilities: "💡",
  Entertainment: "🎮",
  Healthcare: "🏥",
  Shopping: "🛍️",
  Other: "📦",
}

function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description)
      setAmount(editingExpense.amount)
      setCategory(editingExpense.category)
    }
  }, [editingExpense])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!description.trim() || !amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid description and amount")
      return
    }

    onSubmit({
      ...(editingExpense || {}),
      description: description.trim(),
      amount: Number.parseFloat(amount),
      category,
    })

    // Reset form
    setDescription("")
    setAmount("")
    setCategory("Food")
  }

  const handleCancel = () => {
    setDescription("")
    setAmount("")
    setCategory("Food")
    onCancelEdit()
  }

  return (
    <div>
      <h2>
        <svg className="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="description">
            <svg
              className="icon-small"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ display: "inline-block", marginRight: "4px" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            <svg
              className="icon-small"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ display: "inline-block", marginRight: "4px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            <svg
              className="icon-small"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ display: "inline-block", marginRight: "4px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Category
          </label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
          {editingExpense && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
