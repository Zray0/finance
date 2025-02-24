import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

function WelcomePage() {
    return (
        <div className="welcome-container">
            <div className="welcome-overlay">
                <h1 className="welcome-heading">Welcome to Finance Tracker</h1>
                <p className="welcome-text">Take control of your finances with smart and insightful reports</p>
                <div className="button-group">
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                    <Link to="/signin" className="btn btn-secondary">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
