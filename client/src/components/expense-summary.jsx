"use client"

import { useState } from "react"

function ExpenseSummary({ expenses, onExport }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear] = useState(new Date().getFullYear())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate monthly expenses
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear
  })

  const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate category breakdown for selected month
  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>
          <svg className="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Summary
        </h2>
        <button onClick={onExport} className="btn btn-success btn-small">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Total Expenses
          </h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            Total Count
          </h3>
          <p>{expenses.length}</p>
        </div>
        <div className="summary-card">
          <h3>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Average Expense
          </h3>
          <p>${expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : "0.00"}</p>
        </div>
      </div>

      <div className="month-filter">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1" }}>
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Filter by Month:</span>
        </div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}>
          {months.map((month, index) => (
            <option key={month} value={index}>
              {month} {selectedYear}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Monthly Total
          </h3>
          <p>${monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Monthly Count
          </h3>
          <p>{monthlyExpenses.length}</p>
        </div>
        {topCategory && (
          <div className="summary-card">
            <h3>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Top Category
            </h3>
            <p style={{ fontSize: "1.25rem" }}>{topCategory[0]}</p>
            <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>${topCategory[1].toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpenseSummary
