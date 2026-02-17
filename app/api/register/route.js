import User from "@/app/models/User";
import {dbConnection} from "@/app/lib/mongodb";
import bcrypt from "bcrypt";


export async function  POST(request){
    try {
      const errors=[]
        const {name, email, password,currency} =await request.json()

        if(!name || name.trim().length<2){
            errors.push('name must be at least 2 characters')
        }
        if(!email || !email.includes("@") || !email.includes(".")){
            errors.push('enter a valid email address')
        }
        if(!password || password.length<6){
            errors.push('password must be at least 6 characters')
        }
        const allowedCurrencies = ["USD", "INR", "PKR", "EUR"];
        if (currency && !allowedCurrencies.includes(currency)) {
            errors.push(`Currency must be one of: ${allowedCurrencies.join(', ')}`);
        }

        if(errors.length > 0){
            return Response.json({
                message:"validation failed",
                errors: errors,
                success:false
            },{status:400})
        }

        await dbConnection()
        const existingUser = await User.findOne({email})
        if(existingUser){
           return Response.json({
               message:"user already exist with this email",
               success:false
           },{status:409})
        }

        const hashPassword=await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashPassword,
            currency
        })
        await newUser.save()
        return Response.json({
            success:true,
            message:"user registered successfully",
            user:{
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                currency:newUser.currency
            }
        },{status:201})

    }catch(error){
console.log(error)
        return Response.json({
            message:"validation failed" + error.message,
            success:false
        },{status:500})
    }
}