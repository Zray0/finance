import React, { useEffect, useState } from 'react';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../services/expenseService';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: 0, category: '' });
    const [editExpenseId, setEditExpenseId] = useState(null);

    // Fetch expenses on component mount
    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        const data = await getExpenses();
        setExpenses(data);
    };

    const handleAddExpense = async () => {
        await addExpense(newExpense);
        fetchExpenses();
        setNewExpense({ description: '', amount: 0, category: '' });
    };

    const handleEditExpense = async (id) => {
        setEditExpenseId(id);
        const expenseToEdit = expenses.find(exp => exp._id === id);
        setNewExpense(expenseToEdit);
    };

    const handleUpdateExpense = async () => {
        await updateExpense(editExpenseId, newExpense);
        fetchExpenses();
        setEditExpenseId(null);
        setNewExpense({ description: '', amount: 0, category: '' });
    };

    const handleDeleteExpense = async (id) => {
        await deleteExpense(id);
        fetchExpenses();
    };

    return (
        <div>
            <h1>Expense Tracker</h1>
            <div>
                <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                />
                {editExpenseId ? (
                    <button onClick={handleUpdateExpense}>Update Expense</button>
                ) : (
                    <button onClick={handleAddExpense}>Add Expense</button>
                )}
            </div>

            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id}>
                        {expense.description} - ${expense.amount} - {expense.category}
                        <button onClick={() => handleEditExpense(expense._id)}>Edit</button>
                        <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseTracker;
