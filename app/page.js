import Link from "next/link";

export default function Home() {
    return (
        <>
            <main>
                <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-4  lg:gap-8 container mx-auto">
                    <section className="section-1 flex flex-col gap-5 p-10 justify-center items-center">
                        <div className="flex gap-2">
                            <img src={"track.gif"} alt={"track"} width={90}/>
                            <h1 className="text-4xl lg:text-7xl font-bold text-blue-500">Track. Save. Grow.</h1>
                        </div>
                        <div>
                            <h2 className="sm:text-4xl lg:text-5xl font-bold">
                                Take Control of Your
                                <span className="text-green-600"> Financial Future</span>
                            </h2>
                            <p className="mt-4 text-md text-gray-500 max-w-md">
                                BudgetFlow helps you track<span className="text-red-500 font-medium"> expenses</span>, set budgets, and
                                achieve your <span className="text-green-600 font-medium">financial</span> goals with smart insights.
                                Our intuitive platform provides real-time analytics, automated categorization, and personalized
                                recommendations to help you make smarter financial decisions every day.
                            </p>
                        </div>
                        <div className="mt-4 flex gap-2 justify-center items-center">
                            <Link href={"/register"} className="text-green-600 bg-white border border-green-600 hover:bg-green-600 hover:text-white focus:ring-4 focus:ring-green-300 font-medium leading-5 rounded-lg text-sm px-8 py-2.5 focus:outline-none transition-colors duration-200">
                                Sign Up
                            </Link>
                            <Link href={"/login"} className="text-blue-600 bg-white border border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium leading-5 rounded-lg text-sm px-8 py-2.5 focus:outline-none transition-colors duration-200">
                                Log in
                            </Link>
                        </div>
                    </section>
                    <section className="section-2 mt-2 lg:mt-8">
                        <img className="lg:mt-8" src={"vector.jpg"}/>
                    </section>
                </div>

                <div className="stats container mx-auto mb-5 px-4 sm:px-6">
                    <div className="mt-2 text-center ">
                        <h2 className="sm:text-3xl lg:text-4xl font-bold">Trusted by <span className="text-blue-500">thousands</span> of Savers.</h2>
                        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
                            Join thousands who have transformed their financial lives and taken control of their
                            spending habits. Our community grows daily as more people discover the power of
                            intelligent budgeting and financial planning.
                        </p>
                    </div>

                    <div className="cards flex flex-col md:flex-row gap-5 mx-auto mt-3 justify-center">

                        <div className="w-full md:w-[30%] bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col gap-4 items-center justify-center p-6 rounded-md">
                            <img className="rounded-full" width={54} src={"dollar.gif"} alt={"Dollar"}/>
                            <div className="text-center">
                                <h2 className="text-3xl text-white sm:text-4xl font-bold">$2.5M+</h2>
                                <p className="text-gray-600 mt-3 text-2xl max-w-2xl font-medium">Total <span className="text-white">Saved</span></p>
                                <p className="text-white mt-3 mx-auto text-sm sm:text-base">
                                    Our users collectively save millions monthly through smart budgeting and expense tracking.
                                    The average user saves 25% more within their first three months of using BudgetFlow.
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-[30%] bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col gap-4 items-center justify-center p-6 rounded-md">
                            <img className="rounded-full" width={54} src={"user.gif"} alt={"users"}/>
                            <div className="text-center">
                                <h2 className="text-3xl sm:text-4xl text-white font-bold">10K+</h2>
                                <p className="mt-3 text-2xl font-medium text-white">Active <span className="text-black">Users</span></p>
                                <p className="text-white mt-3 max-w-lg mx-auto text-sm sm:text-base">
                                    Growing community of budget-conscious people from 50+ countries. Our users range from
                                    students managing their allowances to professionals planning for retirement.
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-[30%] bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 rounded-md">
                            <img className="rounded-full" width={54} src={"success.gif"} alt={"success"}/>
                            <div className="text-center">
                                <h2 className="text-3xl sm:text-4xl text-white font-bold">94%</h2>
                                <p className="text-green-700 mt-3 text-2xl font-medium">Success <span className="text-black">Rate</span></p>
                                <p className="text-white mt-3 max-w-lg mx-auto text-sm sm:text-base">
                                    Users who achieve their savings goals within the first year. Our personalized
                                    goal-setting and progress tracking features help maintain motivation and consistency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
