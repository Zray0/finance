import { BarElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register necessary chart components
ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

function ExpenseChart({ data }) {
    // Ensure data has the correct structure
    const chartData = {
        labels: data.categories, // Should be an array of category names
        datasets: [
            {
                label: 'Expenses by Category',
                data: data.values, // Should be an array of amounts corresponding to categories
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Custom color for the bars
            },
        ],
    };

    return <Bar data={chartData} />; // Render the Bar chart with the data provided
}

export default ExpenseChart;
