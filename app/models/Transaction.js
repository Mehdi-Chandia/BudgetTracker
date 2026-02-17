
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryColor: {
        type: String,
        default: "#3B82F6",
        enum: [
            "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
            "#8B5CF6", "#EC4899", "#6366F1", "#6B7280"
        ]
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);