import React from 'react';
import '../styles/ProgressBar.css';

function BudgetProgress({ budgets, expenses }) {
    const calculatePercentage = (category) => {
        if (!budgets || typeof budgets !== 'object' || !budgets[category] || budgets[category] <= 0) {
            return 0;
        }
        const totalSpent = expenses[category] || 0;
        return Math.min((totalSpent / budgets[category]) * 100, 100);
    };

    return (
        <div className="mt-4">
            <h3>Budget Progress</h3>
            {budgets && Object.keys(budgets).length === 0 ? (
                <p>No budgets set. Use the form above to set your budgets.</p>
            ) : (
                ['Food', 'Transport', 'Entertainment', 'Utilities'].map((category) => (
                    <div key={category} className="mb-3">
                        <strong>{category}</strong>
                        <div className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${calculatePercentage(category)}%` }}
                                aria-valuenow={calculatePercentage(category)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {calculatePercentage(category).toFixed(2)}%
                            </div>
                        </div>
                        <small>
                        ₹{expenses[category] || 0} / ₹{budgets[category] || 0} spent
                        </small>
                    </div>
                ))
            )}
        </div>
    );
}

export default BudgetProgress;
