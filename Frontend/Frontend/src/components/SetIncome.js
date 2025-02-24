import axios from 'axios';
import React, { useState } from 'react';

const SetIncome = ({ userId }) => {
    const [income, setIncome] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!income || income <= 0) {
            setMessage('Please enter a valid income amount.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/income/set-income', {
                userId,
                income: parseFloat(income),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setMessage('Income updated successfully.');
            } else {
                setMessage('Failed to update income.');
            }
        } catch (error) {
            console.error('Error updating income:', error);
            setMessage('Error updating income.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Monthly Income:
                <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Set Income</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default SetIncome;
