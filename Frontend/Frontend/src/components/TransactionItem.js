import React from 'react';

const TransactionItem = ({ date, amount, category, description }) => {
    return (
        <div className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h6>{description}</h6>
                <small className="text-muted">{date} - {category}</small>
            </div>
            <span className={`badge ${amount < 0 ? 'bg-danger' : 'bg-success'}`}>£{amount}</span>
        </div>
    );
};

export default TransactionItem;