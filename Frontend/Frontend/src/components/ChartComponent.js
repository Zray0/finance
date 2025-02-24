import { Chart, registerables } from 'chart.js';
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(...registerables);

function ChartComponent({ data, type }) {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    const chartData = {
        labels: data.labels || [],
        datasets: data.datasets || [],
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {type === 'bar' && <Bar data={chartData} options={chartOptions} />}
            {type === 'pie' && <Pie data={chartData} options={chartOptions} />}
        </div>
    );
}

export default ChartComponent;
