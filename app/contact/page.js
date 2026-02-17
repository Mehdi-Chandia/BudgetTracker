import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link'

export const metadata = {
    title: 'Contact Us - Finance Tracker',
    description: 'Get in touch with our team',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl opacity-90">
                        Have questions? We're here to help.
                    </p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                            <FaEnvelope className="text-2xl text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                        <a
                            href="mailto:support@financetracker.com"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            support@financetracker.com
                        </a>
                        <p className="text-gray-600 text-sm mt-2">We reply within 24 hours</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                            <FaPhone className="text-2xl text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Phone</h3>
                        <a
                            href="tel:+15551234567"
                            className="text-green-600 hover:text-green-800"
                        >
                            +1 (555) 123-4567
                        </a>
                        <p className="text-gray-600 text-sm mt-2">Mon-Fri, 9AM-6PM EST</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                            <FaMapMarkerAlt className="text-2xl text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Location</h3>
                        <p className="text-gray-700">123 Finance Street</p>
                        <p className="text-gray-700">New York, NY 10001</p>
                    </div>
                </div>

                {/* Simple Message */}
                <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600">
                            For support or inquiries, please email us at{' '}
                            <a
                                href="mailto:support@financetracker.com"
                                className="text-blue-600 font-medium hover:text-blue-800"
                            >
                                support@financetracker.com
                            </a>
                            . We're happy to help!
                        </p>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}