import {dbConnection} from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Transaction from "@/app/models/Transaction";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET(request,{params}){
    try {
        await dbConnection();
        const {id}=await params;

        const objectId=new mongoose.Types.ObjectId(id);

        const transaction=await Transaction.findOne({_id:objectId});
        if(!transaction){
            return Response.json({
                success:false,
                message:"Transaction not found"
            },{status:404});
        }

return Response.json({
    success:true,
    message:"Transaction found",
    transaction:transaction
})

    }catch(error){
return Response.json({
    success:false,
    message:"Transaction fetching failed",
    error:error
},{status:500});
    }
}


export async function PUT(request,{params}) {
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user?.id){
            return Response.json({
                success: false,
                message: "Please log in first"
            },{ status: 401 });
        }
        const {id}=await params;
        const objectId=new mongoose.Types.ObjectId(id);
        const data = await request.json();

        const allowedColors = [
            "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
            "#8B5CF6", "#EC4899", "#6366F1", "#6B7280"
        ];

        if(data.categoryColor && !allowedColors.includes(data.categoryColor)) {
            return Response.json({
                success: false,
                message:"Invalid category color"
            },{status: 400 });
        }

        const allowedTypes=["income","expense"];

        if(data.type && !allowedTypes.includes(data.type)){
            return Response.json({
                success: false,
                message: "Type must be income or expense"
            }, { status: 400 });
        }

        await dbConnection();

        const updatedTransaction=await Transaction.findByIdAndUpdate({
                _id:objectId,
                user:session.user.id
            },
            {
                $set: {
                    categoryName:data.categoryName,
                    type:data.type,
                    amount:data.amount,
                    description:data.description,
                    categoryColor:data.categoryColor,
                    date:data.date
                }
            },
            {
                new:true,
                runValidators:true
            }
        )

        if(!updatedTransaction){
            return Response.json({
                success: false,
                message: "failed updating Transaction",
            },{status: 400 });
        }

        return Response.json({
            success: true,
            message: "Transaction updated",
            transaction: updatedTransaction
        },{status:200})

    }catch(error){
        console.error("Update transaction error:", err);
        return Response.json({
            success: false,
            message: "Server error"
        }, { status: 500 });
    }
}

export async function DELETE(request,{params}){
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user?.id){
            return Response.json({
                success: false,
                message: "Please log in first"
            },{ status: 401 });
        }

        const {id}=await params;
        await dbConnection();

        const deletedTransaction=await Transaction.findOneAndDelete({
            _id:id,
            user:session.user.id
        })

        if(!deletedTransaction){
            return Response.json({
                success: false,
                message: "Transaction not found"
            },{status: 404 });
        }

        return Response.json({
            success:true,
            message:"Transaction deleted successfully",
            deleted:deletedTransaction
        },{status:200});

    }catch (error) {
        return Response.json({
            success: false,
            message:"Error deleting the transaction"
        },{status: 500 });
    }
}