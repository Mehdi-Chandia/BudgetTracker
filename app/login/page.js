"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {showToast} from "@/app/utils/Toast";

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit =async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res=await signIn("credentials",{
                email: formData.email,
                password: formData.password,
                redirect:false
            })
            if(res.error){
                setError("Invalid email or password")
                showToast.error("Invalid email or password")
            }else{
                showToast.success("Welcome back!")
                router.push("/")
                router.refresh()
            }
        }catch(error){
            console.log(error)
            setError("Something went wrong")
            showToast.error("Something went wrong")
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="header mt-2 text-center">
                    <h2 className="text-3xl font-bold text-blue-600">Welcome Back</h2>
                    <p className="text-md text-gray-500">Sign in to your account</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form className="my-4" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mt-4">
                        <label className="block font-semibold text-gray-800 mb-1">Email</label>
                        <input
                            className="w-full focus:outline-none border px-3 py-2 rounded-lg border-gray-300"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mt-4">
                        <label className="block font-semibold text-gray-800 mb-1">Password</label>
                        <input
                            className="w-full focus:outline-none border px-3 py-2 rounded-lg border-gray-300"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Using for first time?{" "}
                            <Link className="text-blue-500 hover:text-blue-700" href="/register">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;