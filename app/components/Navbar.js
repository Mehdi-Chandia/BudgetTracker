"use client"
import React, {useState} from 'react'
import Link from "next/link";

const Navbar=()=>{
    const [isOpen,setIsOpen]=useState(false)
    return(
        <>
            <nav className="flex items-center justify-around gap-3 h-20 w-full bg-gradient-to-r from-blue-600 to-blue-800 mx-auto px-8 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <img className="" width={40} src={"budgeting.png"} alt="budgetflow" />
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        <Link href={"/"} className="text-blue-200">Budget</Link>Flow
                    </h1>
                </div>
                <ul className="md:flex hidden gap-6 text-white">
                    <Link href={"/"} className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Home</Link>
                    <Link href={"/about"} className="hover:text-blue-200 cursor-pointer transition-colors duration-200">About</Link>
                    <Link href={"/transactions"} className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Transactions</Link>
                    <Link href={"/budgets"} className="hover:text-blue-200 cursor-pointer transition-colors duration-200">Budgets</Link>
                </ul>
                <div>
                    <Link href={"/dashboard"} className="bg-emerald-500 hidden md:block hover:bg-emerald-600 px-6 py-2 font-semibold rounded-lg text-white transition-all duration-200 shadow-md">
                        Dashboard
                    </Link>
                </div>
                <button
                    onClick={()=>setIsOpen(!isOpen)}
                    className="md:hidden block"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <img src={"cross.gif"} alt={"Close menu"} width={25}/>
                    ) : (
                        <img src={"menu.gif"} alt={"Open menu"} width={25}/>
                    )}
                </button>
            </nav>

            {isOpen && (
                <div className="md:hidden bg-gradient-to-b from-blue-700 to-blue-900 w-[89vw] mx-auto p-6 shadow-lg mt-2 rounded-md">
                    <ul className="flex flex-col gap-4 text-white justify-center items-center">
                        <Link href={"/"} onClick={()=>setIsOpen(false)} className="hover:text-blue-200 cursor-pointer py-3 border-b border-blue-600">Home</Link>
                        <Link href={"/about"} onClick={()=>setIsOpen(false)} className="hover:text-blue-200 cursor-pointer py-3 border-b border-blue-600">About</Link>
                        <Link href={"/transactions"} onClick={()=>setIsOpen(false)} className="hover:text-blue-200 cursor-pointer py-3 border-b border-blue-600">Transactions</Link>
                        <Link href={"/budgets"} onClick={()=>setIsOpen(false)} className="hover:text-blue-200 cursor-pointer py-3 border-b border-blue-600">Budgets</Link>
                    </ul>
                    <div className="mt-6">
                        <Link href={"/dashboard"} onClick={()=>setIsOpen(false)} className="bg-emerald-500 hover:bg-emerald-600 w-full py-3 px-4 font-semibold rounded-lg text-white transition-all duration-200">
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
export default Navbar;