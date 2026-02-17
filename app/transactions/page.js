"use client"
import React, {useEffect, useState} from 'react'
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {showToast} from "@/app/utils/Toast";
import {NextResponse as res} from "next/server";

const Transactions=()=>{
    const router=useRouter()
    const {data:session,status}=useSession();
    const [transactions,setTransactions]=useState([]);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
    }, [status, router])


    const getTransactions=async()=>{
        if(status !=="authenticated") return;
        try {
            setLoading(true)
            const res=await fetch("/api/transaction",{
                headers:{
                    "Content-Type": "application/json"
                },
                credentials:"include"
            });

            const data=await res.json();
            console.log(data)

            if(data.transactions){
                setTransactions(data.transactions)
            }else if(Array.isArray(data)){
                setTransactions(data)
            }else {
                console.log("failed fetching transactions...");
                showToast.error("Failed to fetch transactions...");
            }

        }catch(error){
            console.log("something went wrong fetching transactions...");
            setError(error)
            showToast.error("Something went wrong fetching transactions...");
        }finally{
            setLoading(false)
        }
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    useEffect(()=>{
        if(status !=="authenticated") return;
        getTransactions()
    },[status])


    if (status === 'loading') {
        return <div className="h-screen ">Loading...</div>
    }

    const deleteTransaction=async(id)=>{
        if(!window.confirm("are you sure,do you want to delete this transaction?"))return;

     try {
         const res=await fetch(`/api/transaction/${id}`,{
             method:"DELETE",
             headers:{
                 "Content-Type": "application/json"
             },
             credentials:"include"
         })
         const data=await res.json();

         if(res.ok){
             getTransactions()
             showToast.success("transaction deleted successfully.")
         }else {
             showToast.error(data.message || "Failed to delete transaction");
         }
     }catch(error){
console.log(error)
         showToast.error("error deleting transaction");
     }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return(
        <>
        <div className="min-h-screen w-full">
            <div className="text-center space-y-2 mt-4">
                <h2 className="text-3xl font-bold text-blue-500">Your All Transactions</h2>
                <p className="text-sm ">Manage your transactions to see your
                    <span className="text-green-500"> income</span> and calculate
                    <span className="text-red-500"> expenses</span> </p>
                <p className="text-lg font-medium">{transactions.length} Transactions so far!</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg mt-4">
                    {error}
                </div>)}


                {transactions.length > 0 ?(
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:gap-4 container mx-auto mt-4 w-full">
                        {transactions.map((transaction)=>{
                            const date = new Date(transaction.date);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            return (
                                <div key={transaction._id}   className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]">

                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getCategoryEmoji(transaction.categoryName)}</span>
                                            <div>
                                                <h3 className="font-bold text-blue-600 capitalize">
                                                    {transaction.categoryName}
                                                </h3>
                                                <span className={`text-xs px-2 py-1 rounded-full ${transaction.type == "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {transaction.type}
                                </span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="mb-4 flex-grow min-h-[60px]">
                                        <p className="text-gray-700">
                                            📜 {transaction.description}
                                        </p>
                                    </div>

                                    {/* Amount & Date */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'income' ? '+' : '-'}
                                                {transaction.amount}
                                                <span className="text-gray-500 text-sm ml-1">{session?.user?.currency}</span>
                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            {formattedDate}
                                        </div>
                                    </div>

                                    {/* Buttons - Always at bottom */}
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/transactions/${transaction._id}`}
                                                className="flex-1 py-2.5 bg-gradient-to-l from-green-500 to-blue-700 text-white rounded-lg font-medium text-center hover:opacity-90 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteTransaction(transaction._id)}
                                                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg font-medium hover:opacity-80 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ):(
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <div className="text-5xl mb-4">💰</div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Transactions yet</h3>
                        <p className="text-gray-500 mb-6">Create your first Transactions to get started</p>
                        <Link href={"/transactions/create"}

                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
                        >
                            <span>+</span>
                            <span>Create First Transaction</span>
                        </Link>
                    </div>
                )}
            {transactions.length > 0 && (
                <div className="mt-10 text-center mb-6">
                    <Link href={"/transactions/create"}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
                    >
                        <span>+</span>
                        <span>Add New Transaction</span>
                    </Link>
                </div>
            )}

            <div className="hidden md:block mt-6 text-center mb-6 w-full">
                <h2 className="text-3xl font-bold text-green-500">Your Transactions table</h2>
                <div className="mt-2 border border-gray-200 rounded-lg container mx-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-gray-500 font-medium uppercase text-left">Category</th>
                            <th className="px-4 py-2 text-gray-500 font-medium uppercase text-left">Type</th>
                            <th className="px-4 py-2 text-gray-500 font-medium uppercase text-left">Amount</th>
                            <th className="px-4 py-2 text-gray-500 font-medium uppercase text-left">Starting Date</th>
                            <th className="px-4 py-2 text-gray-500 font-medium uppercase text-left">Description</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white ">
                        {transactions.map((transaction)=>{
                           return (
                               <tr key={transaction._id} className="">
                                   <td className="px-6 py-4 whitespace-nowrap hover:bg-gray-50">
                                       <div className="flex items-center">
                                        <span className="text-lg mr-2">
                                            {getCategoryEmoji(transaction.categoryName)}
                                        </span>
                                           <span className="text-sm font-medium text-gray-900">
                                            {transaction.categoryName}
                                        </span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap hover:bg-gray-50 text-left">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        transaction.type === 'income'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </span>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap hover:bg-gray-50 text-left">
                                       <div className="text-sm font-medium text-gray-900">
                                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {transaction.amount}
                                        </span>
                                           <span className="text-gray-500 text-xs ml-1">{session?.user?.currency}</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hover:bg-gray-50 text-left">
                                       {formatDate(transaction.date)}
                                   </td>
                                   <td className="px-6 py-4 hover:bg-gray-50 text-left">
                                       <div className="text-sm text-gray-900 max-w-xs truncate ">
                                           {transaction.description || 'No description'}
                                       </div>
                                   </td>
                               </tr>
                           )
                        })}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
        </>
    )
}
export default Transactions;