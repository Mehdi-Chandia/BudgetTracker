import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    currency:{
        type:String,
        enum:["USD","INR","PKR","EUR"],
        default:"PKR",
    }
},{ timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);