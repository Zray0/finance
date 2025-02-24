// src/components/BudgetForm.js
import axios from 'axios';
import React, { useState } from 'react';
import '../styles/BudgetForm.css'; // Import a separate CSS file for styling

function BudgetForm({ userId, onBudgetUpdate }) {
    const [budgets, setBudgets] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (category, value) => {
        setBudgets({ ...budgets, [category]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = { budgets };
            await axios.post(`http://localhost:5000/api/budgets/${userId}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Budgets saved successfully.');
            onBudgetUpdate(budgets);

            // Reset the form
            setBudgets({});
        } catch (error) {
            console.error('Error saving budgets:', error);
            setMessage('Failed to save budgets. Please try again.');
        }
    };

    return (
        <div className="budget-form-container">
            <h3 className="form-title">Set Monthly Budgets</h3>
            <form onSubmit={handleSubmit} className="budget-form">
                {['Food', 'Transport', 'Entertainment', 'Utilities'].map((category) => (
                    <div className="form-group" key={category}>
                        <label className="form-label">{category} Budget:</label>
                        <input
                            type="number"
                            className="form-input"
                            value={budgets[category] || ''}
                            onChange={(e) => handleChange(category, Number(e.target.value))}
                            min="0"
                            placeholder={`Enter ${category.toLowerCase()} budget`}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary">Save Budgets</button>
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
}

export default BudgetForm;