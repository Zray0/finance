import React from 'react';
import '../styles/ExpenseCard.css'; // Import the CSS file

const ExpenseCard = ({ title, amount }) => {
    return (
        <div className="expense-card">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">£{amount}</p>
            </div>
        </div>
    );
};

export default ExpenseCard;
