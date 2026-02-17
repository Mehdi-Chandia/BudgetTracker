"use client"
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useSession} from 'next-auth/react'
import Link from "next/link";
import {showToast} from "@/app/utils/Toast";

const AllBudgets = () => {
    const router = useRouter();
    const {data: session, status} = useSession();

    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting,setDeleting] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
    }, [status, router])



    const getBudgets = async () => {
        if (status !== "authenticated") return;

        try {
            setLoading(true);
            const res = await fetch("/api/budget", {
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            const data = await res.json();
            if (data.budgets) {
                setBudgets(data.budgets);
            } else if (Array.isArray(data)) {
                setBudgets(data);
            } else {
                setError("No budgets found");
            }
        } catch (err) {
            setError("Failed to load budgets");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            getBudgets();
        }
    }, [status]);

    if (status === 'loading') {
        return <div className="h-screen ">Loading...</div>
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTypeColor = (type) => {
        const colors = {
            'monthly': 'bg-green-100 text-green-800',
            'weekly': 'bg-blue-100 text-blue-800',
            'yearly': 'bg-purple-100 text-purple-800',
            'custom': 'bg-yellow-100 text-yellow-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const deleteBudget=async(id)=>{
        if(!window.confirm("are you sure,do you want to delete this Budget?"))return;

        try {
            setDeleting(true)
            const res=await fetch(`/api/budget/${id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials:"include"
            })
            const data=await res.json();

            if(res.ok){
                getBudgets()
                showToast.success("Budget deleted successfully.")
            }else {
                alert(data.message || "Failed to delete Budget");
                showToast.error("Error deleting budget");
            }
        }catch(error){
            console.log(error)
            showToast.error("error deleting transaction");
        }finally {
            setDeleting(false)
        }
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

    if (deleting) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-red-600">Deleting budget...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">All Budgets</h1>
                    <p className="text-gray-500 mt-2">Manage your spending plans</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}


                {budgets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map((budget) => (
                            <div
                                key={budget._id}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-5">

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800 mb-1">
                                                {budget.description || budget.categoryName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Started {formatDate(budget.startingDate)}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(budget.type)}`}>
                                            {budget.type.charAt(0).toUpperCase() + budget.type.slice(1)}
                                        </span>
                                    </div>


                                    <div className="mb-4">
                                        <p className="text-2xl font-bold text-gray-800">
                                            {budget.amount.toLocaleString()} PKR
                                        </p>
                                        <p className="text-sm text-gray-500">Total budget</p>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-700">Category:</span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                                {budget.categoryName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>0% used</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
                                        </div>
                                    </div>

                                    <div className="mt-2.5 pt-4 flex justify-between items-center">
                                        <Link href={`/budgets/${budget._id}/update `} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-all duration-200">Edit</Link>
                                        <button onClick={()=>deleteBudget(budget._id)} className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 transition-all duration-200">Delete</button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <div className="text-5xl mb-4">💰</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No budgets yet</h3>
                        <p className="text-gray-500 mb-6">Create your first budget to get started</p>
                        <Link href={"/budgets/create"}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
                        >
                            <span>+</span>
                            <span>Create First Budget</span>
                        </Link>
                    </div>
                )}


                {budgets.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link href={"/budgets/create"}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition"
                        >
                            <span>+</span>
                            <span>Add New Budget</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBudgets;