import Link from 'next/link'
import { FaChartLine, FaShieldAlt, FaUsers, FaLightbulb } from 'react-icons/fa'

export const metadata = {
    title: 'About Us - Finance Tracker',
    description: 'Learn about our mission to simplify personal finance management',
}

export default function AboutPage() {
    const features = [
        {
            icon: <FaChartLine className="text-3xl text-blue-600" />,
            title: "Smart Tracking",
            description: "Automatically categorize and track all your expenses and income."
        },
        {
            icon: <FaShieldAlt className="text-3xl text-green-600" />,
            title: "Secure & Private",
            description: "Your financial data is encrypted and never shared with third parties."
        },
        {
            icon: <FaUsers className="text-3xl text-purple-600" />,
            title: "User-Friendly",
            description: "Designed for everyone, from budgeting beginners to finance experts."
        },
        {
            icon: <FaLightbulb className="text-3xl text-yellow-600" />,
            title: "Insightful Analytics",
            description: "Get personalized insights to help you make better financial decisions."
        }
    ]

    const team = [
        {
            name: "Alex Johnson",
            role: "Founder & CEO",
            bio: "10+ years in fintech, passionate about financial literacy."
        },
        {
            name: "Maria Garcia",
            role: "Lead Developer",
            bio: "Full-stack developer specializing in secure financial applications."
        },
        {
            name: "David Chen",
            role: "Product Designer",
            bio: "Creates intuitive interfaces that make finance management effortless."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            About Finance Tracker
                        </h1>
                        <p className="text-xl opacity-90 max-w-3xl mx-auto">
                            We're on a mission to simplify personal finance management
                            and help people achieve their financial goals.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Founded in 2023, Finance Tracker was born from a simple idea:
                        financial management shouldn't be complicated. We believe everyone
                        deserves the tools to take control of their finances, regardless
                        of their background or expertise.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold text-blue-700 mb-4">Our Mission</h3>
                        <p className="text-gray-700 mb-4">
                            To empower individuals with intuitive tools that make financial
                            management accessible, understandable, and actionable for everyone.
                        </p>
                        <p className="text-gray-700">
                            We're committed to breaking down the barriers that prevent people
                            from achieving financial stability and growth.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold text-green-700 mb-4">Our Vision</h3>
                        <p className="text-gray-700 mb-4">
                            A world where financial stress is minimized through smart,
                            accessible technology that guides people toward financial freedom.
                        </p>
                        <p className="text-gray-700">
                            We envision a future where everyone has the knowledge and tools
                            to make informed financial decisions with confidence.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 text-center mb-1">
                                    {member.name}
                                </h4>
                                <p className="text-blue-600 font-medium text-center mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 text-center">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-blue-200">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">$50M+</div>
                            <div className="text-blue-200">Tracked Monthly</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-200">Support Available</div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Ready to take control of your finances?
                    </h3>
                    <Link
                        href="/register"
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Get Started Free
                    </Link>
                    <p className="mt-4 text-gray-600">
                        No credit card required • 30-day free trial
                    </p>
                </div>
            </div>
        </div>
    )
}