import axios from 'axios';
import React, { useState } from 'react';
import '../styles/Settings.css'; // Import the CSS file for styling

function Settings() {
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to set your income.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/users/${userId}/income`, 
                { income: monthlyIncome },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Monthly income set successfully.');
            } else {
                setMessage('Failed to set monthly income.');
            }
        } catch (error) {
            console.error('Error setting income:', error);
            setMessage('Error setting income. Please try again.');
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Settings</h2>
            
            <div className="income-form-container">
                <h3 className="form-heading">Set Monthly Income</h3>
                <form onSubmit={handleIncomeSubmit} className="income-form">
                    <label htmlFor="incomeInput" className="form-label">Monthly Income:</label>
                    <input
                        type="number"
                        id="incomeInput"
                        className="form-input"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        placeholder="Enter your monthly income"
                        required
                    />
                    <button type="submit" className="btn-submit">Set Income</button>
                </form>
                {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
            </div>
        </div>
    );
}

export default Settings;
