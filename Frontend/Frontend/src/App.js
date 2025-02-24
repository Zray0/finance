import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust the import path as necessary
import Dashboard from './pages/Dashboard';
import ExpenseInput from './pages/ExpenseInput';
import HomePage from './pages/HomePage';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import WelcomePage from './pages/WelcomePage';
import ChatbotButton from './components/Chatbot'; // Import the chatbot button
import './styles/global.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
    const [userName, setUserName] = useState(''); // State to hold user's name

    const handleLogin = (name) => {
        setIsAuthenticated(true); // Update state to indicate user is logged in
        setUserName(name); // Store user's name on login
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Update state to indicate user is logged out
        setUserName(''); // Clear user's name on logout
    };

    return (
        <Router>
            {/* Render Navbar only if the user is authenticated */}
            {isAuthenticated && <Navbar onLogout={handleLogout} />}
            
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
                <Route path="/home" element={isAuthenticated ? <HomePage userName={userName} /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/expense-input" element={isAuthenticated ? <ExpenseInput /> : <Navigate to="/" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
            </Routes>

            {/* Chatbot Button (Always Visible) */}
            <ChatbotButton />
        </Router>
    );
}

export default App;
