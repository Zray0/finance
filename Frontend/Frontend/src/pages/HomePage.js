import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
    const [userName, setUserName] = useState('');
    const [overview, setOverview] = useState({ totalExpenses: 0, totalIncome: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [predictedExpense, setPredictedExpense] = useState(null);
    const navigate = useNavigate();

    // Fetch data on page load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const savedUserName = localStorage.getItem('userName');

        if (!token || !userId) {
            navigate('/signin');
            return;
        }

        setUserName(savedUserName);

        const fetchData = async () => {
            try {
                await fetchOverviewData(userId, token); // Fetch overview
                const transactions = await fetchTransactions(userId, token); // Fetch transactions

                // Fetch predicted expense using the Flask API
                if (transactions.length > 0) {
                    await fetchPredictedExpense(transactions);
                }
            } catch (error) {
                console.error('Error fetching data or making prediction:', error);
               //  setErrorMessage('Error fetching data. Please try again later.');
            }
        };

        fetchData();
    }, [navigate]);

    // Fetch overview data from backend
    const fetchOverviewData = async (userId, token) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/overview/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data) {
                setOverview({
                    totalExpenses: response.data.totalExpenses || 0,
                    totalIncome: response.data.totalIncome || 0,
                    balance: response.data.balance || 0,
                });
            } else {
             //   setErrorMessage('No overview data available.');
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
           //  setErrorMessage('Failed to fetch financial overview.');
        }
    };

    // Fetch transactions from backend
    const fetchTransactions = async (userId, token) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const transactions = response.data || [];
            setRecentTransactions(transactions);
            return transactions; // Return transactions for prediction
        } catch (error) {
            console.error('Error fetching transactions:', error);
           //  setErrorMessage('Failed to fetch transactions.');
            return [];
        }
    };

    // Fetch predicted expense from Flask API
    const fetchPredictedExpense = async (transactions) => {
        try {
            // Extract transaction amounts
            const transactionAmounts = transactions.map(tx => tx.amount);

            // Call Flask API for prediction
            const response = await axios.post('http://127.0.0.1:5000/predict', {
                sequence: transactionAmounts,
            });

            if (response.data && response.data.predictedValue !== undefined) {
                setPredictedExpense(response.data.predictedValue); // Update predicted expense
            } else {
               // setErrorMessage('Failed to fetch predicted expense.');
            }
        } catch (error) {
            console.error('Error fetching predicted expense:', error);
          //   setErrorMessage('Prediction failed. Please try again.');
        }
    };

    return (
        <div className="home-container">
            <h1 className="welcome-message">Welcome, {userName}!</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Financial Overview Section */}
            <section className="financial-overview">
                <h3>Financial Overview</h3>
                <div className="overview-cards">
                    <div className="card">
                        <h4>Total Expenses</h4>
                        <p>₹{overview.totalExpenses}</p>
                    </div>
                    <div className="card">
                        <h4>Total Income</h4>
                        <p>₹{overview.totalIncome}</p>
                    </div>
                    <div className="card">
                        <h4>Balance</h4>
                        <p>₹{overview.balance}</p>
                    </div>
                </div>
            </section>

            {/* Recent Transactions Section */}
            <section className="recent-transactions">
                <h3>Recent Transactions</h3>
                {recentTransactions.length > 0 ? (
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.category}</td>
                                    <td>₹{transaction.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent transactions to display.</p>
                )}
            </section>

            {/* Predicted Expense Section */}
            {predictedExpense !== null && (
                <section className="predicted-expense">
                    <h3>Predicted Next Month Expense</h3>
                    <div className="predicted-card">
                        <p>₹{predictedExpense.toFixed(2)}</p>
                    </div>
                </section>
            )}
        </div>
    );
}

export default HomePage;
