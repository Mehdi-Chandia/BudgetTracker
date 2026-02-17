
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Transaction from "@/app/models/Transaction";
import { dbConnection } from "@/app/lib/mongodb";
import mongoose from "mongoose";
import transaction from "@/app/models/Transaction";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return Response.json({
                success: false,
                message: "Please log in first"
            }, { status: 401 });
        }

        await dbConnection();

        const transactions = await Transaction.find({
            user: session.user.id
        }).sort({ date: -1 });

        return Response.json({
            success: true,
            transactions: transactions
        });

    } catch (error) {
        console.error("Error:", error);
        return Response.json({
            success: false,
            message: "Server error"
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return Response.json({
                success: false,
                message: "Please log in first"
            }, { status: 401 });
        }

        const data = await request.json();

        // Validation
        if (!data.amount || data.amount <= 0) {
            return Response.json({
                success: false,
                message: "Amount must be positive"
            }, { status: 400 });
        }

        if (!data.type || (data.type !== "income" && data.type !== "expense")) {
            return Response.json({
                success: false,
                message: "Type must be income or expense"
            }, { status: 400 });
        }

        if (!data.categoryName || data.categoryName.trim().length < 2) {
            return Response.json({
                success: false,
                message: "Category name must be at least 2 characters"
            }, { status: 400 });
        }

        const allowedColors = [
            "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
            "#8B5CF6", "#EC4899", "#6366F1", "#6B7280"
        ];

        if (!data.categoryColor || !allowedColors.includes(data.categoryColor)) {
            return Response.json({
                success: false,
                message: "Invalid category color"
            }, { status: 400 });
        }

        await dbConnection();

        const transaction = await Transaction.create({
            user: session.user.id,
            categoryName: data.categoryName.trim(),
            categoryColor: data.categoryColor,
            amount: data.amount,
            type: data.type,
            description: data.description || "",
            date: data.date ? new Date(data.date) : new Date()
        });

        return Response.json({
            success: true,
            message: "Transaction added",
            transaction: transaction
        }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return Response.json({
            success: false,
            message: "Server error"
        }, { status: 500 });
    }
}

