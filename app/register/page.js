"use client"
import React, {useState} from 'react'
import Link from "next/link";
import { useForm } from "react-hook-form"
import {useRouter} from "next/navigation";
import {showToast} from "@/app/utils/Toast";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const router = useRouter();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setError("")
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    currency: data.currency || "PKR"
                })
            })

            const result = await response.json();

            if(response.ok) {
                router.push("/login")
                showToast.success("Your account has been created successfully!")
            } else {
                setError(result.message || "Registration failed")
                showToast.error("Registration failed.")
            }
        } catch(err) {
            setError("Something went wrong")
            showToast.error("Something went wrong")
        }
    }

    return (
        <>
            <div className="h-screen flex items-center justify-center w-full bg-gray-50 p-4">
                <div className="w-full bg-white max-w-md p-8 rounded-lg shadow-md">
                    <div className="text-center">
                        <h2 className="text-2xl text-green-600 md:text-3xl font-bold">Sign Up here!</h2>
                        <p className="text-gray-500 text-sm font-light">Create your account</p>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Name */}
                        <div className="mt-4">
                            <label className="font-semibold mb-1 block">Name</label>
                            <input
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                })}
                                className={`w-full px-3 py-2 focus:outline-none border rounded-md ${
                                    errors.name ? "border-red-400" : "border-gray-300"
                                }`}
                                type="text"
                                placeholder="Enter your name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <label className="font-semibold mb-1 block">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className={`w-full px-3 py-2 focus:outline-none border rounded-md ${
                                    errors.email ? "border-red-400" : "border-gray-300"
                                }`}
                                type="email"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mt-4">
                            <label className="font-semibold mb-1 block">Password</label>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
                                        message: "Password must contain at least one letter and one number"
                                    }
                                })}
                                className={`w-full px-3 py-2 focus:outline-none border rounded-md ${
                                    errors.password ? "border-red-400" : "border-gray-300"
                                }`}
                                type="password"
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Must be at least 6 characters with letters and numbers
                            </p>
                        </div>

                        {/* Currency */}
                        <div className="mt-4">
                            <label className="font-semibold mb-1 block">Currency</label>
                            <select
                                {...register("currency")}
                                className="w-full px-3 py-2 focus:outline-none border border-gray-300 rounded-md"
                            >
                                <option value="PKR">PKR - Pakistani Rupee</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="INR">INR - Indian Rupee</option>
                            </select>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                disabled={isSubmitting}
                                className={`w-full bg-green-500 text-white px-3 py-3 rounded-lg font-medium ${
                                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                                } transition-all duration-200`}
                            >
                                {isSubmitting ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link className="text-blue-500 hover:text-blue-600 font-medium" href="/login">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Register;