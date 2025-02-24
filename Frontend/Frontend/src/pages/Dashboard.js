import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import BudgetComparisonChart from '../components/BudgetComparisonChart';
import BudgetForm from '../components/BudgetForm';
import BudgetProgress from '../components/BudgetProgress';
import ChartComponent from '../components/ChartComponent';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
    const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
    const [errorMessage, setErrorMessage] = useState('');
    const [budgets, setBudgets] = useState({});
    const [expensesByCategory, setExpensesByCategory] = useState({});
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                setErrorMessage('User not authenticated.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/expenses/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data && response.data.length > 0) {
                    const categories = {};
                    const monthlyExpenses = {};
                    const categoryExpenses = {};
                    let total = 0;

                    response.data.forEach(expense => {
                        const category = expense.category || 'Uncategorized';
                        const month = new Date(expense.date).getMonth() + 1;

                        categories[category] = (categories[category] || 0) + expense.amount;
                        categoryExpenses[category] = (categoryExpenses[category] || 0) + expense.amount;
                        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;

                        total += expense.amount;
                    });

                    setExpensesByCategory(categoryExpenses);
                    setTotalExpenses(total);

                    setCategoryData({
                        labels: Object.keys(categories),
                        datasets: [
                            {
                                label: 'Expenses by Category',
                                data: Object.values(categories),
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                            },
                        ],
                    });

                    setMonthlyData({
                        labels: Object.keys(monthlyExpenses).map(m => `Month ${m}`),
                        datasets: [
                            {
                                label: 'Monthly Expenses',
                                data: Object.values(monthlyExpenses),
                                backgroundColor: 'rgba(75,192,192,0.4)',
                                borderColor: 'rgba(75,192,192,1)',
                                borderWidth: 1,
                            },
                        ],
                    });

                    const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setRecentExpenses(sortedExpenses.slice(0, 5));
                } else {
                    setCategoryData({ labels: [], datasets: [] });
                    setMonthlyData({ labels: [], datasets: [] });
                    setRecentExpenses([]);
                    setTotalExpenses(0);
                }

                const budgetResponse = await axios.get(`http://localhost:5000/api/budgets/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (budgetResponse.data && budgetResponse.data.budgets) {
                    setBudgets(budgetResponse.data.budgets);
                } else {
                    setBudgets({});
                }
            } catch (error) {
                console.error('Error fetching data:', error);
               //  setErrorMessage('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const exportDataToPDF = () => {
        const doc = new jsPDF();
        doc.text('Expense Report', 14, 16);

        const categoryTableColumns = ['Category', 'Amount'];
        const categoryTableRows = Object.entries(expensesByCategory).map(([category, amount]) => [
            category,
            `₹${amount.toFixed(2)}`,
        ]);

        doc.autoTable({
            head: [categoryTableColumns],
            body: categoryTableRows,
            startY: 20,
            theme: 'striped',
            headStyles: { fillColor: [54, 162, 235] },
        });

        const monthlyTableColumns = ['Month', 'Amount'];
        const monthlyTableRows = monthlyData.labels.map((month, index) => [
            month,
            `₹${monthlyData.datasets[0].data[index].toFixed(2)}`,
        ]);

        doc.autoTable({
            head: [monthlyTableColumns],
            body: monthlyTableRows,
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'striped',
            headStyles: { fillColor: [255, 99, 132] },
        });

        doc.save('expense-report.pdf');
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="card">
                <BudgetForm userId={localStorage.getItem('userId')} onBudgetUpdate={setBudgets} />
            </div>

            <div className="card">
                <BudgetProgress budgets={budgets} expenses={expensesByCategory} />
            </div>

            <div className="card">
                <h3>Total Expenses</h3>
                <p>₹{totalExpenses.toFixed(2)}</p>
            </div>

            <div className="card">
                <h3>Recent Expenses</h3>
                {recentExpenses.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExpenses.map(expense => (
                                <tr key={expense.id || expense.id}>
                                    <td>{expense.date}</td>
                                    <td>{expense.category}</td>
                                    <td>₹{expense.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No recent expenses available.</p>
                )}
            </div>
            <div className="card">
                <h3>Expenses by Category</h3>
            <   ChartComponent data={categoryData} type="pie" />
            </div>

            <div className="card">
                <BudgetComparisonChart budgets={budgets} expensesByCategory={expensesByCategory} />
            </div>

            <div className="card">
                <ChartComponent data={monthlyData} type="bar" />
            </div>

            <div className="export-button">
                <button onClick={exportDataToPDF} className="btn btn-primary">
                    Export Report as PDF
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
