import React from 'react';
import { Bar } from 'react-chartjs-2';

const BudgetComparisonChart = ({ budgets, expensesByCategory }) => {
    // Prepare data for the bar chart
    const categories = Object.keys(budgets);
    const budgetValues = categories.map(category => budgets[category] || 0);
    const expenseValues = categories.map(category => expensesByCategory[category] || 0);

    const data = {
        labels: categories,
        datasets: [
            {
                label: 'Budget',
                data: budgetValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', 
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Expenses',
                data: expenseValues,
                backgroundColor: 'rgba(255, 99, 132, 0.6)', 
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        devicePixelRatio: window.devicePixelRatio || 1, 
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 12, 
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        size: 12,
                    },
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 14, // Font size for the legend
                    },
                },
            },
        },
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Budget vs. Actual Expenses</h4>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BudgetComparisonChart;
