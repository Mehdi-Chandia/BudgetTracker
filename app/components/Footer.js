// components/Footer.js
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <img src="/budgeting.png" alt="BudgetFlow" width={32} height={32} />
                        <h2 className="text-xl font-bold">
                            <span className="text-blue-400">Budget</span>Flow
                        </h2>
                    </div>

                    {/* Links */}
                    <div className="flex gap-6 mb-4 md:mb-0">
                        <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
                        <a href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</a>
                        <a href="/about" className="text-gray-300 hover:text-white transition">About</a>
                        <a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a>
                    </div>

                    {/* Social */}
                    <div className="flex gap-4">
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">𝕏</a>
                        <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white">⚫</a>
                        <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white">in</a>
                    </div>

                </div>

                {/* Divider */}
                <hr className="border-gray-800 my-4" />

                {/* Bottom Section */}
                <div className="text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} BudgetFlow. All rights reserved.</p>
                    <p className="mt-1">Take control of your financial future.</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;