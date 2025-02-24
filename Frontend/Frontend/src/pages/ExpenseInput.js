import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/ExpenseInput.css'; // Import the CSS file

const ExpenseInput = () => {
    const [userId, setUserId] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [expenseData, setExpenseData] = useState({
        date: '',
        amount: '',
        category: '',
        description: '',
        isRecurring: false,
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setMessage('User not logged in. Please log in again.');
            return;
        }

        const fetchExpenses = async () => {
            const token = localStorage.getItem('token');
            if (!token || !storedUserId) {
                setMessage('User not authenticated.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/expenses/${storedUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                setMessage('Failed to fetch expenses. Please try again later.');
            }
        };

        if (storedUserId) {
            fetchExpenses();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRecurringChange = () => {
        setExpenseData((prevData) => ({
            ...prevData,
            isRecurring: !prevData.isRecurring,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to add or update an expense.');
            return;
        }

        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/api/expenses/${editExpenseId}`, { ...expenseData, userId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses(expenses.map((exp) => (exp._id === editExpenseId ? { ...exp, ...expenseData } : exp)));
                setEditMode(false);
                setEditExpenseId(null);
                setMessage('Expense updated successfully!');
            } else {
                const response = await axios.post('http://localhost:5000/api/expenses', { userId, ...expenseData }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses([...expenses, response.data.expense]);
                setMessage('Expense added successfully!');
            }

            setExpenseData({
                date: '',
                amount: '',
                category: '',
                description: '',
                isRecurring: false,
            });
        } catch (error) {
            console.error('Error saving expense:', error);
            setMessage('Failed to save expense. Please try again.');
        }
    };

    const handleDeleteExpense = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('User not authenticated.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses(expenses.filter((exp) => exp._id !== id));
                setMessage('Expense deleted successfully.');
            } catch (error) {
                console.error('Error deleting expense:', error);
                setMessage('Failed to delete expense. Please try again.');
            }
        }
    };

    const handleEditExpense = (expense) => {
        setEditMode(true);
        setEditExpenseId(expense._id);
        setExpenseData({
            date: expense.date.split('T')[0],
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            isRecurring: expense.isRecurring,
        });
    };

    return (
        <div className="expense-input-container">
            <h2 className="expense-input-title">Log Your Expense</h2>

            {/* Expense Form */}
            <form className="expense-form" onSubmit={handleSubmit}>
                <label>Date:</label>
                <input
                    type="date"
                    name="date"
                    value={expenseData.date}
                    onChange={handleChange}
                    required
                />

                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={expenseData.amount}
                    onChange={handleChange}
                    required
                    step="0.01"
                />

                <label>Category:</label>
                <select
                    name="category"
                    value={expenseData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                </select>

                <label>Description:</label>
                <input
                    type="text"
                    name="description"
                    value={expenseData.description}
                    onChange={handleChange}
                />

                <label>
                    Recurring:
                    <input
                        type="checkbox"
                        checked={expenseData.isRecurring}
                        onChange={handleRecurringChange}
                    />
                </label>

                <button type="submit">{editMode ? 'Update Expense' : 'Add Expense'}</button>
            </form>

            {message && <p className={`message ${message.includes('failed') ? 'error' : ''}`}>{message}</p>}

            {/* Expense List */}
            <div className="expense-list">
                <h3>Your Expenses</h3>
                {expenses.length > 0 ? (
                    <ul>
                        {expenses.map((expense) => (
                            <li key={expense._id}>
                                {expense.date.split('T')[0]} - {expense.category} - ₹{expense.amount.toFixed(2)}
                                <button onClick={() => handleEditExpense(expense)} className="btn-warning">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteExpense(expense._id)} className="btn-danger">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No expenses found.</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseInput;
