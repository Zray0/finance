import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

// Add a new expense
export const addExpense = async (expenseData) => {
    try {
        const response = await axios.post(API_URL, expenseData);
        return response.data;
    } catch (error) {
        console.error('Error adding expense:', error);
    }
};

// Get all expenses
export const getExpenses = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
};

// Update an expense by ID
export const updateExpense = async (id, expenseData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, expenseData);
        return response.data;
    } catch (error) {
        console.error('Error updating expense:', error);
    }
};

// Delete an expense by ID
export const deleteExpense = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
};
