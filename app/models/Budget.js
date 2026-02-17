import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description:{
        type: String,
        required: true
    },
    categoryName:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ["weekly", "monthly","yearly","custom"],
        default: "monthly"
    },
    startingDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    }
},{ timestamps: true });

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema);