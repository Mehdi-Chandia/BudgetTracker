import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {dbConnection} from "@/app/lib/mongodb";
import Budget from "@/app/models/Budget";

export async function POST(request){
try {
    const session=await getServerSession(authOptions)
    if(!session || !session.user?.id){
        return Response.json({
            success: false,
            message: "please login first",
        },{status: 401});
    }
    const data=await request.json();
    const allowedTypes=["weekly", "monthly","yearly","custom"]
    if(!data.type || !allowedTypes.includes(data.type)){
        return Response.json({
            success: false,
            message: "please enter a valid type",
        },{status: 400});
    }
    if(!data.amount || data.amount <= 0){
        return Response.json({
            success: false,
            message: "please enter a valid amount",
        },{status: 400});
    }
    await dbConnection();
    const newBudget=await Budget.create({
        user:session.user.id,
        description:data.description || " ",
        type:data.type,
        amount:data.amount,
        categoryName:data.categoryName,
        startingDate:data.startingDate || Date.now()
    })

    return Response.json({
        success: true,
        message:"Budget created successfully",
        budget:newBudget,
    },{status:201});
}catch(err){
return Response.json({
    success: false,
    message:err.message || "internal server error"
},{status:500});
 }
}

export async function GET(request){
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user?.id){
            return Response.json({
                success: false,
                message: "please login first",
            },{status: 401});
        }
        await dbConnection();
        const budgets=await Budget.find({
            user:session.user.id,
        }).sort({date:-1})

        return Response.json({
            success: true,
            message:"Budget found successfully",
            budgets:budgets,
        })
    }catch(err){

    }
}