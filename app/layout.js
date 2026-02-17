import { Poppins } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/app/components/SessionWrapper";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import ToastProvider from "@/app/providers/ToastProvider";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata = {
    title: "Budget Flow",
    description: "Track your finances easily",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
        <SessionWrapper>
            <NavbarWrapper/>
            <ToastProvider>
                {children}
            </ToastProvider>
            <Footer/>
        </SessionWrapper>
        </body>
        </html>
    );
}
