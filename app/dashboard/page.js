"use client"
import React, {useEffect, useState} from 'react'
import SpendingChart from "@/app/components/SpendingChart";
import {useSession, signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {showToast} from "@/app/utils/Toast";
import Link from "next/link";

const Dashboard = () => {
    const {data: session, status} = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState([])
    const [budgets, setBudgets] = useState([])
    const [income, setIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState(0)
    const [remaining, setRemaining] = useState(0)
    const [budget, setBudget] = useState({
        totalBudgets: 0,
        spendBudget: 0,
        remainingBudget: 0,
    })
    const [sidebarOpen, setSidebarOpen] = useState(false)


    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
    }, [status, router])


    const getBudgets = async () => {
        if (status !== "authenticated") {
            console.log("not authenticated")
            return;
        }
        try {
            setLoading(true);
            const res = await fetch("/api/budget", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            const data = await res.json()
            if (data.budgets) {
                console.log("budgets data", data.budgets)
                setBudgets(data.budgets)

            } else if (Array.isArray(data)) {
                setBudgets(data)

            } else {
                console.log("error fetching budgets")
            }
        } catch (err) {
            console.log("budgets fetching failed", err)
        }finally {
            setLoading(false);
        }
    }

    const getTransactions = async () => {
        if (status !== "authenticated") {
            console.log("Not authenticated yet");
            return;
        }

        try {
            const response = await fetch("/api/transaction", {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            console.log("Transactions for user:", data);
            if (data.transactions) {
                setTransactions(data.transactions);

            } else if (Array.isArray(data)) {
                setTransactions(data)

            } else {
                console.log("No transactions found.");
                setTransactions([])
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            showToast.success("Logged out successfully!");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            showToast.error("Failed to logout");
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            getTransactions();
            getBudgets()
        }
    }, [status]);

    useEffect(() => {
        if (transactions.length > 0 || budgets.length > 0) {
            totalCalculations(transactions, budgets);
        }
    }, [transactions, budgets]);


    if (status == "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const updatedTransactions = transactions.slice(0, 4)

    const updatedBudgets = budgets.slice(0, 4)

    // Function to get emoji for category
    const getCategoryEmoji = (category) => {
        const emojis = {
            'Food': '🍔',
            'Transport': '🚗',
            'Entertainment': '🎬',
            'Shopping': '🛍️',
            'Bills': '📋',
            'Income': '💰',
            'Other': '📝'
        };
        return emojis[category] || '📝';
    };

    const totalCalculations = (transactions, budgets) => {

        const income = transactions.reduce((sum, transaction) => {
            return transaction.type == "income" ? sum + transaction.amount : sum
        }, 0)

        const expense = transactions.reduce((sum, transaction) => {
            return transaction.type == "expense" ? sum + transaction.amount : sum
        }, 0)

        const totbudgt = budgets.reduce((sum, budget) => {
            return sum + budget.amount
        }, 0)

        const remaingbdgt = totbudgt - expense

        const remainingBalance = income - expense;

        setRemaining(remainingBalance)
        setIncome(income)
        setExpenses(expense)

        setBudget({
            totalBudgets: totbudgt,
            spendBudget: expense,
            remainingBudget: remaingbdgt
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading budgets...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Mobile Menu Button */}
                <div className="lg:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                    >
                        {sidebarOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Sidebar */}
                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    fixed lg:relative z-40 w-64 lg:w-1/5 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm flex flex-col transition-transform duration-300
                `}>
                    {/* User Profile Section */}
                    <div className="p-6 flex flex-col items-center gap-3 border-b border-gray-200">
                        <img className="rounded-full border-4 border-white shadow-md w-16 h-16 object-cover"
                             src={"profile.gif"} alt="profile"/>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">{session?.user?.name}</p>
                            <p className="text-sm text-green-600 font-medium">Premium Member</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="p-4 space-y-2 flex-1">
                        <Link href={"/dashboard"} className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm transform hover:scale-[1.02]">
                            <span className="text-lg">📊</span>
                            <span className="font-medium">Dashboard</span>
                        </Link>

                        <button
                            onClick={() => router.push('/transactions')}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-[1.02] hover:border-l-4 hover:border-blue-500"
                        >
                            <span className="text-lg">💰</span>
                            <span className="font-medium">Transactions</span>
                        </button>

                        <button
                            onClick={() => router.push('/budgets')}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-[1.02] hover:border-l-4 hover:border-blue-500"
                        >
                            <span className="text-lg">📈</span>
                            <span className="font-medium">Budgets</span>
                        </button>

                        <button
                            onClick={() => router.push('/about')}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-[1.02] hover:border-l-4 hover:border-blue-500"
                        >
                            <span className="text-lg">📋</span>
                            <span className="font-medium">About Us</span>
                        </button>

                        <button
                            onClick={() => router.push('/contact')}
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-[1.02] hover:border-l-4 hover:border-blue-500"
                        >
                            <span className="text-lg">⚙️</span>
                            <span className="font-medium">Contact</span>
                        </button>
                    </div>

                    {/* User Details Card */}
                    <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 transform hover:scale-[1.02] transition-all">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Account Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Email:</span>
                                <span className="text-sm font-medium truncate">{session?.user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Currency:</span>
                                <span className="text-sm font-medium text-green-600">{session?.user?.currency}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 text-sm">Member Since:</span>
                                <span className="text-sm font-medium">Jan 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Text */}
                    <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transform hover:scale-[1.02] transition-all">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Track your spending, review categories, and monitor goals—all from one easy sidebar. Stay on top of your budget at a glance.
                        </p>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm transform hover:scale-[1.02]"
                        >
                            <span>🚪</span>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Right Content */}
                <div className="flex-1 w-full lg:w-4/5 p-4 lg:p-6 mt-16 lg:mt-0">
                    <div className="text-center mb-8">
                        <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-blue-700">Financial Dashboard</h1>
                        <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">Track your spending, monitor budgets, and achieve your financial goals.
                            Updated in real-time.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-green-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Total <span className="text-green-500">Income</span></h3>
                            <p className="text-2xl font-bold text-green-600">
                                {income} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">💰</span>
                                <span className="text-sm text-gray-600">Total earnings</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-red-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Total <span className="text-red-500">Expenses</span></h3>
                            <p className="text-2xl font-bold text-red-600">
                                {expenses} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">📉</span>
                                <span className="text-sm text-gray-600">Total spending</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2"><span className="text-blue-500">Remaining</span> Balance</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {remaining} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">💸</span>
                                <span className="text-sm text-gray-600">Available balance</span>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-b-4 border-orange-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Planned <span className="text-orange-500">Budget</span></h3>
                            <p className="text-2xl font-bold text-orange-600">
                                {budget.totalBudgets} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">💰</span>
                                <span className="text-sm text-gray-600">Total planned budget</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-b-4 border-purple-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Spent <span className="text-purple-500">Budget</span></h3>
                            <p className="text-2xl font-bold text-purple-600">
                                {budget.spendBudget} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">📉</span>
                                <span className="text-sm text-gray-600">Amount spent</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-b-4 border-cyan-500 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-gray-800 mb-2"><span className="text-cyan-500">Remaining</span> Budget</h3>
                            <p className="text-2xl font-bold text-cyan-600">
                                {budget.remainingBudget} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                            </p>
                            <div className="flex items-center mt-2">
                                <span className="text-lg mr-2">💸</span>
                                <span className="text-sm text-gray-600">Budget remaining</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Recent Transactions */}
                    <div className="mb-12">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Recent Transactions</h2>
                            <p className="text-gray-500 mt-2">Your last 4 transactions</p>
                        </div>

                        {updatedTransactions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {updatedTransactions.map((transaction) => {
                                    const date = new Date(transaction.date);
                                    const formattedDate = date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    });

                                    return (
                                        <div
                                            key={transaction._id}
                                            className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                                            style={{borderLeft: `4px solid ${transaction.categoryColor || '#3b82f6'}`}}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                                                        style={{backgroundColor: `${transaction.categoryColor || '#3b82f6'}20`}}
                                                    >
                                                        {getCategoryEmoji(transaction.categoryName)}
                                                    </div>
                                                    <div className="text-left">
                                                        <h3 className="font-bold text-lg text-gray-800">
                                                            {transaction.categoryName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{formattedDate}</p>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <p className={`text-xl font-bold ${
                                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount} {session?.user?.currency || 'PKR'}
                                                    </p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                                                        transaction.type === 'income'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                                                    </span>
                                                </div>
                                            </div>

                                            {transaction.description && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {transaction.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-5xl mb-4">📭</div>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">No transactions yet</h3>
                                <p className="text-gray-500 mb-6">Start by adding your first transaction</p>
                                <button
                                    onClick={() => router.push('/transactions/create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    + Add Your First Transaction
                                </button>
                            </div>
                        )}

                        <div className="text-center mt-8">
                            <button
                                onClick={() => router.push('/transactions/create')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                            >
                                + Add New Transaction
                            </button>
                        </div>
                        <Link href={"/transactions"} className="mt-2 flex gap-2 justify-center items-center ">
                            <button className="text-gray-500 hover:scale-105 hover:text-gray-600">View all Transactions</button>
                            <img width={35} src={"arrow.gif"} alt={"arrow"}/>
                        </Link>
                    </div>

                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Budgets Section */}
                    <div className="mb-12">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-green-600">Your Budgets</h2>
                            <p className="text-gray-500 mt-2">Manage your spending limits here</p>
                        </div>

                        {updatedBudgets.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {updatedBudgets.map((budgetItem) => {
                                        const date = new Date(budgetItem.startingDate);
                                        const formattedDate = date.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        });
                                        const progressPercentage = budgetItem.amount > 0 ?
                                            Math.min(100, Math.round((budget.spendBudget / budgetItem.amount) * 100)) : 0;

                                        return (
                                            <div
                                                key={budgetItem._id}
                                                className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                                        {getCategoryEmoji(budgetItem.categoryName)}
                                                        {budgetItem.categoryName}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                        ${budgetItem.type === "monthly" ? "bg-green-100 text-green-800" :
                                                        budgetItem.type === "weekly" ? "bg-blue-100 text-blue-800" :
                                                            budgetItem.type === "yearly" ? "bg-purple-100 text-purple-800" :
                                                                "bg-orange-100 text-orange-800"}`}
                                                    >
                                                        {budgetItem.type.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                                    {budgetItem.amount} <span className="text-sm font-normal">{session?.user?.currency || 'PKR'}</span>
                                                </p>
                                                <p className="text-sm text-gray-500 mb-4">Started: {formattedDate}</p>

                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                        <span>Progress</span>
                                                        <span>{progressPercentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full ${
                                                                progressPercentage > 80 ? 'bg-red-500' :
                                                                    progressPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                            style={{width: `${progressPercentage}%`}}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {budgetItem.description && (
                                                    <p className="text-sm text-gray-700 line-clamp-2">
                                                        {budgetItem.description}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => router.push('/budgets/create')}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        + Create New Budget
                                    </button>
                                </div>
                                <Link href={"/budgets"} className="mt-2 flex gap-2 justify-center items-center ">
                                    <button className="text-gray-500 hover:scale-105 hover:text-gray-600">View all Budgets</button>
                                    <img width={35} src={"arrow.gif"} alt={"arrow"}/>
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-5xl mb-4">📭</div>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">No budgets yet</h3>
                                <p className="text-gray-500 mb-6">Start by adding your first budget</p>
                                <button
                                    onClick={() => router.push('/budgets/create')}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    + Add Your First Budget
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-300 my-8"></div>

                    {/* Spending Chart */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Spending Trends</h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transform hover:shadow-lg transition-all duration-300">
                            <SpendingChart />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Dashboard;