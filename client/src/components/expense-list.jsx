"use client"

import { useState } from "react"

const CATEGORIES = ["All", "Food", "Transport", "Utilities", "Entertainment", "Healthcare", "Shopping", "Other"]

function ExpenseList({ expenses, onEdit, onDelete }) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  // Use null for deletion confirmation ID, which will now be the MongoDB '_id' string
  const [deleteConfirm, setDeleteConfirm] = useState(null) 

  const filteredExpenses =
    selectedCategory === "All" ? expenses : expenses.filter((expense) => expense.category === selectedCategory)

  const handleDelete = (id) => {
    // 'id' is now the MongoDB '_id'
    onDelete(id)
    setDeleteConfirm(null)
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Expenses</h2>
        <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
          {filteredExpenses.length} {filteredExpenses.length === 1 ? "expense" : "expenses"}
        </span>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-tab ${selectedCategory === category ? "active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>No expenses found</p>
            <p style={{ fontSize: "0.875rem", marginTop: "8px" }}>
              {selectedCategory === "All"
                ? "Start by adding your first expense"
                : `No expenses in ${selectedCategory} category`}
            </p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            // Use MongoDB '_id' for the key
            <div key={expense._id} className="expense-item"> 
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className="expense-category">{expense.category}</span>
                  {/* Expense date is now a MongoDB ISO string, ensure correct parsing */}
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="expense-amount">${expense.amount.toFixed(2)}</div>
                <div className="expense-actions">
                  <button onClick={() => onEdit(expense)} className="btn btn-secondary btn-small">
                    Edit
                  </button>
                  {/* Use MongoDB '_id' for deletion confirmation */}
                  <button onClick={() => setDeleteConfirm(expense._id)} className="btn btn-danger btn-small"> 
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Expense</h3>
            <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">
                Cancel
              </button>
              {/* Pass the MongoDB '_id' to the handler */}
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger"> 
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseList

