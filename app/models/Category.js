
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["income", "expense"]
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    icon: {
        type: String,
        default: "📁"
    },
    color: {
        type: String,
        required: true,
        default: "#3B82F6",
        enum: [
            "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
            "#8B5CF6", "#EC4899", "#6366F1", "#6B7280"
        ]
    },
    budget: {
        type: Number,
        default: 0
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);