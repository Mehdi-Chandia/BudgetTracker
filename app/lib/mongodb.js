import mongoose from 'mongoose';


const uri=process.env.MONGODB_URI

if(!uri){
    throw new Error("MongoDB URI is required");
}
let isConnected=false;

export const dbConnection=async ()=>{
    if(isConnected) return;

    try {
   const db=await mongoose.connect(uri)
        console.log("mongodb Connected")
        isConnected=true;
}catch(error){
    console.error("MongoDB Connection Error: ", error);
}
}