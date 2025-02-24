import React from 'react';

function ExpenseCategoryTable({ categories }) {
    return (
        <table className="table mt-4">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount Spent</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                    <tr key={category.name}>
                        <td>{category.name}</td>
                        <td>£{category.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ExpenseCategoryTable;
