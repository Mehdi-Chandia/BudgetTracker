"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {showToast} from "@/app/utils/Toast";

const CreateTransaction = () => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        categoryName: 'Food',
        categoryColor: '#EF4444', // Red
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
    })

    // Color options with names
    const colorOptions = [
        { hex: '#EF4444', name: 'Red' },
        { hex: '#3B82F6', name: 'Blue' },
        { hex: '#10B981', name: 'Green' },
        { hex: '#F59E0B', name: 'Orange' },
        { hex: '#8B5CF6', name: 'Purple' },
        { hex: '#EC4899', name: 'Pink' },
        { hex: '#6366F1', name: 'Indigo' },
        { hex: '#6B7280', name: 'Gray' }
    ]

    // Category options
    const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Income', 'Other']

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create transaction')
            }

            console.log('Transaction created:', data)
            showToast.success("Transaction created successfully")
            router.push('/dashboard')
            router.refresh()

        } catch (err) {
            setError(err.message || 'Something went wrong')
            showToast.error("something went wrong" + err.message)
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (status !== 'authenticated') {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        New Transaction
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (PKR) *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0.00"
                                required
                                min="0.01"
                                step="0.01"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color *
                            </label>
                            <select
                                name="categoryColor"
                                value={formData.categoryColor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                {colorOptions.map((color) => (
                                    <option key={color.hex} value={color.hex}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows="2"
                                placeholder="Add a note about this transaction"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="pt-4 space-y-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Transaction'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full border border-gray-300 text-gray-700 py-2.5 rounded font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateTransaction;