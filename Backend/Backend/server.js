const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
dotenv.config();

// Import route handlers
const signupRoutes = require('./routes/signup');
const signinRoutes = require('./routes/signin');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/userRoutes');
const overviewRoutes = require('./routes/overviewRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const incomeRoutes = require('./routes/income');
const dashboardRoutes = require('./routes/dashboard');
const budgetRoutes = require('./routes/budgets');

// Import middleware
const authenticate = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and rate limiting middleware
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());


// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

// Route handlers
app.use('/api/signup', signupRoutes);
app.use('/api/signin', signinRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/overview', authenticate, overviewRoutes);
app.use('/api/transactions', authenticate, transactionRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(error => console.error('MongoDB connection error:', error));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
