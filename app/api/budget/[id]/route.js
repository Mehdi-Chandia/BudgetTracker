import {dbConnection} from "@/app/lib/mongodb";
import Budget from "@/app/models/Budget";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET(request,{params}){
    try {
      await dbConnection();
      const {id}=await params;

      const objectId=new mongoose.Types.ObjectId(id);

      const budget=await Budget.findOne({_id:objectId});
      if(!budget){
          return Response.json({
              success:false,
              message:"No such budget with id "+id,
          },{status:404});
      }
      return Response.json({
          success:true,
          message:"budget foud",
          budget:budget
      },{status:200});

    }catch (error) {
        return Response.json({
            success:false,
            message:"error fetching budget",
            error:error
        },{status:500});
    }
}

export async function PUT(request,{params}){
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user?.id){
            return Response.json({
                success:false,
                message:"please login first"
            },{status:401});
        }
        const data=await request.json()
        const {id}=await params;
        const objectId=new mongoose.Types.ObjectId(id);

        const allowedTypes=["weekly", "monthly","yearly","custom"]
        if(data.type && !allowedTypes.includes(data.type)){
            return Response.json({
                success: false,
                message: "please enter a valid type",
            },{status: 400});
        }

        if(data.amount && data.amount <= 0){
            return Response.json({
                success: false,
                message: "please enter a valid amount",
            },{status: 400});
        }

        await dbConnection();

        const updatedBudget=await Budget.findByIdAndUpdate({
            _id:objectId,
            user:session.user.id
        },
            {
                $set:{
                    type:data.type,
                    description:data.description,
                    amount:data.amount,
                    categoryName:data.categoryName,
                    startingDate:data.startingDate
                }
            },
            {
                new:true,
                runValidators:true
            }
            )
        if(!updatedBudget){
            return Response.json({
                success:false,
                message:"failed updating budget",
            },{status:404});
        }

        return Response.json({
            success:true,
            message:"budget updated successfully",
            budget:updatedBudget,
        },{status:200});

    }catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"internal server error",
        },{status:500})
    }
}

export async function DELETE(request,{params}){
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user?.id){
            return Response.json({
                success:false,
                message:"please login first"
            },{status:401});
        }

        const {id}=await params;
        const objectId=new mongoose.Types.ObjectId(id);

        await dbConnection();

        const deletedBudget=await Budget.findByIdAndDelete({
            _id:objectId,
        user:session.user.id
        });

        if(!deletedBudget){
            return Response.json({
                success: false,
                message: "Transaction not found"
            },{status: 404 });
        }

        return Response.json({
            success:true,
            message:"Transaction deleted successfully",
            deleted:deletedBudget
        },{status:200});

    }catch(error){
        console.log(error);
        return Response.json({
            success:false,
            message:"internal server error",
        },{status:500});
    }
}