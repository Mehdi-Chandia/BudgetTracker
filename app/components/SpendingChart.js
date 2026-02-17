"use client";

import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { useSession } from 'next-auth/react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const SpendingChart = () => {
    const { data: session, status } = useSession();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('line');
    const [timeRange, setTimeRange] = useState('monthly');

    const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'];
    const categoryColors = {
        'Food': '#10B981',      // Green
        'Transport': '#3B82F6', // Blue
        'Entertainment': '#8B5CF6', // Purple
        'Shopping': '#EC4899',  // Pink
        'Bills': '#F59E0B',     // Orange
        'Other': '#6B7280',     // Gray
        'Income': '#059669',    // Dark Green
    };

    // Fetch transactions
    useEffect(() => {
        if (status !== "authenticated") return;

        const getTransactions = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/transaction", {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                const data = await response.json();
                const transactionsData = data.transactions || data || [];
                setTransactions(transactionsData);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, [status]);

    // Filter expenses only (exclude income)
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    // Get current month name
    const getCurrentMonth = () => {
        const date = new Date();
        return date.toLocaleString('default', { month: 'short' });
    };

    // Get last 6 months
    const getLast6Months = () => {
        const months = [];
        const date = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(date.getMonth() - i);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }
        return months;
    };

    // Get last 6 weeks
    const getLast6Weeks = () => {
        const weeks = [];
        const date = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setDate(date.getDate() - (i * 7));
            weeks.push(`Week ${Math.ceil(d.getDate() / 7)}`);
        }
        return weeks;
    };

    // Calculate spending by category for the last 6 months
    const calculateMonthlySpending = () => {
        const months = getLast6Months();
        const result = {};

        categories.forEach(category => {
            result[category] = months.map(month => {
                return expenseTransactions
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        const transactionMonth = transactionDate.toLocaleString('default', { month: 'short' });
                        return transactionMonth === month && t.categoryName === category;
                    })
                    .reduce((sum, t) => sum + (t.amount || 0), 0);
            });
        });

        return { months, data: result };
    };

    // Calculate spending by category for the last 6 weeks
    const calculateWeeklySpending = () => {
        const weeks = getLast6Weeks();
        const result = {};

        categories.forEach(category => {
            result[category] = weeks.map((week, index) => {
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - ((5 - index) * 7));
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);

                return expenseTransactions
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate >= weekStart &&
                            transactionDate <= weekEnd &&
                            t.categoryName === category;
                    })
                    .reduce((sum, t) => sum + (t.amount || 0), 0);
            });
        });

        return { weeks, data: result };
    };

    // Calculate category totals (pie chart data)
    const calculateCategoryTotals = () => {
        const totals = {};
        const colors = [];

        categories.forEach(category => {
            const total = expenseTransactions
                .filter(t => t.categoryName === category)
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            if (total > 0) {
                totals[category] = total;
                colors.push(categoryColors[category]);
            }
        });

        return {
            labels: Object.keys(totals),
            data: Object.values(totals),
            colors: colors
        };
    };

    // Prepare data for the selected chart
    const getChartData = () => {
        if (timeRange === 'monthly') {
            const { months, data } = calculateMonthlySpending();
            const datasets = categories
                .filter(category => data[category].some(value => value > 0))
                .map(category => ({
                    label: category,
                    data: data[category],
                    borderColor: categoryColors[category],
                    backgroundColor: `${categoryColors[category]}20`,
                    tension: 0.4,
                    fill: chartType === 'line',
                }));

            return {
                labels: months,
                datasets
            };
        } else { // weekly
            const { weeks, data } = calculateWeeklySpending();
            const datasets = categories
                .filter(category => data[category].some(value => value > 0))
                .map(category => ({
                    label: category,
                    data: data[category],
                    borderColor: categoryColors[category],
                    backgroundColor: `${categoryColors[category]}20`,
                    tension: 0.4,
                    fill: chartType === 'line',
                }));

            return {
                labels: weeks,
                datasets
            };
        }
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Spending Trends`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y} ${session?.user?.currency || 'PKR'}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `Amount (${session?.user?.currency || 'PKR'})`
                },
                ticks: {
                    callback: function(value) {
                        return value + ' ' + (session?.user?.currency || 'PKR');
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: timeRange === 'monthly' ? 'Months' : 'Weeks'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    // Pie chart data for category distribution
    const pieChartData = calculateCategoryTotals();

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading spending data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (expenseTransactions.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center py-12">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No spending data yet</h3>
                    <p className="text-gray-500 mb-6">Add some expense transactions to see your spending trends</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Chart Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">Chart Type:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-4 py-2 rounded-md transition-all ${chartType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Line
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-2 rounded-md transition-all ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Bar
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">Time Range:</span>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-4 py-2 rounded-md transition-all ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeRange('monthly')}
                            className={`px-4 py-2 rounded-md transition-all ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="h-80">
                    {chartType === 'line' ? (
                        <Line data={getChartData()} options={options} />
                    ) : (
                        <Bar data={getChartData()} options={options} />
                    )}
                </div>
            </div>

            {/* Category Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Totals */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Category Breakdown</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {categories.map(category => {
                            const total = expenseTransactions
                                .filter(t => t.categoryName === category)
                                .reduce((sum, t) => sum + (t.amount || 0), 0);

                            if (total === 0) return null;

                            const percentage = (total / expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)) * 100;

                            return (
                                <div key={category} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: categoryColors[category] }}
                                            ></div>
                                            <span className="font-medium text-gray-700">{category}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            {total} {session?.user?.currency || 'PKR'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: categoryColors[category]
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{percentage.toFixed(1)}% of total</span>
                                        <span>
                                            {expenseTransactions.filter(t => t.categoryName === category).length} transactions
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Spending Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-600">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)}
                                    <span className="text-sm font-normal ml-1">{session?.user?.currency || 'PKR'}</span>
                                </p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-600">Total Transactions</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {expenseTransactions.length}
                                    <span className="text-sm font-normal ml-1">transactions</span>
                                </p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-600">Average per Transaction</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {expenseTransactions.length > 0
                                        ? (expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / expenseTransactions.length).toFixed(2)
                                        : 0
                                    }
                                    <span className="text-sm font-normal ml-1">{session?.user?.currency || 'PKR'}</span>
                                </p>
                            </div>
                            <div className="text-3xl">📈</div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-600">Most Spent Category</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {(() => {
                                        const categoryTotals = {};
                                        categories.forEach(cat => {
                                            categoryTotals[cat] = expenseTransactions
                                                .filter(t => t.categoryName === cat)
                                                .reduce((sum, t) => sum + (t.amount || 0), 0);
                                        });
                                        const maxCategory = Object.keys(categoryTotals).reduce((a, b) =>
                                            categoryTotals[a] > categoryTotals[b] ? a : b
                                        );
                                        return maxCategory;
                                    })()}
                                </p>
                            </div>
                            <div className="text-3xl">🏆</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpendingChart;