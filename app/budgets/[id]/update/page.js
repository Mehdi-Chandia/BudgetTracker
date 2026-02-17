"use client"
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {showToast} from "@/app/utils/Toast";

const UpdateBudget = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isSubmitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        categoryName: "",
        type: "monthly",
        amount: "",
        startingDate: "",
        description: ""
    })


    const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"]
    const budgetTypes = [
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "yearly", label: "Yearly" },
        { value: "custom", label: "Custom" }
    ]

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status !== "authenticated" || !id) {
            return;
        }

        const getBudget = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`/api/budget/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Budget not found");
                        showToast.error("Budget not found");
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (!result.success || !result.budget) {
                    setError(result.message || "Failed to load budget");
                    showToast.error("Failed to load budget");
                    return;
                }

                const budget = result.budget;

                const formattedDate = formatDateForInput(budget.startingDate);

                setFormData({
                    description: budget.description || "",
                    startingDate: formattedDate,
                    categoryName: budget.categoryName || "",
                    amount: budget.amount ? String(budget.amount) : "",
                    type: budget.type || "monthly",
                });

                showToast.success("Budget data loaded successfully");

                console.log("Budget data loaded successfully:", {
                    categoryName: budget.categoryName,
                    startingDate: formattedDate,
                    amount: budget.amount,
                    type: budget.type,
                    description: budget.description
                });

            } catch (err) {
                console.log(err)
                setError("Failed to load budget: " + err.message)
                showToast.error("Failed to load budget: " + err.message)
            } finally {
                setLoading(false)
            }
        }
        getBudget()
    }, [status, id, router])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.categoryName || !formData.type || !formData.amount || !formData.startingDate) {
            setError("Please fill all required fields")
            showToast.error("Please fill all required fields")
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            setError("Please enter a valid amount (greater than 0)");
            return;
        }

        try {
            setSubmitting(true)
            setError("")

            const dateObj = new Date(formData.startingDate);
            const isoDate = dateObj.toISOString();

            const response = await fetch(`/api/budget/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryName: formData.categoryName,
                    amount: parseFloat(formData.amount),
                    startingDate: isoDate,
                    description: formData.description,
                    type: formData.type,
                }),
                credentials: "include"
            })

            const data = await response.json()
            if (response.ok && data.success) {
               showToast.success("Budget updated successfully")
                router.push("/budgets")
                router.refresh()
            } else {
                setError(data.message || data.error || "Error updating budget")
                showToast.error("Error updating budget")
            }
        } catch (err) {
            console.log(err)
            setError("Network error. Please try again.")
            showToast.error("Network error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading budget details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Budget</h1>
                    <p className="text-gray-600 mt-2">Update your budget details</p>
                </div>


                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}


                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Budget Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Period *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {budgetTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.type === "weekly" && "Budget resets every week"}
                                {formData.type === "monthly" && "Budget resets every month"}
                                {formData.type === "yearly" && "Budget resets every year"}
                                {formData.type === "custom" && "Custom budget period"}
                            </p>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Amount *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">
                                    {session?.user?.currency || "$"}
                                </span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Maximum amount you want to spend in this period
                            </p>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                name="startingDate"
                                value={formData.startingDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                The date when this budget period starts
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Add notes about this budget (e.g., 'Groceries budget', 'Entertainment allowance')"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : "Update Budget"}
                        </button>

                    </form>

                    {/* Cancel Button */}
                    <button
                        onClick={() => router.back()}
                        className="w-full mt-4 py-3 text-gray-600 font-medium hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Fields marked with * are required</p>
                    <p className="mt-1">Budget will automatically reset according to the selected period</p>
                </div>

            </div>
        </div>
    )
}

export default UpdateBudget;