import connectMongoDB from "../../../libs/mongodb";
import Tension from "../../../models/tension";
import {NextResponse} from "next/server";

export async function POST(request) {
    const {bigTension, smallTension} = await request.json()
    await connectMongoDB()
    await Tension.create({bigTension, smallTension})
    return NextResponse.json({message:"Successfully created tension"},{status:201})
}

export async function GET() {
    await connectMongoDB()
   const tension = await Tension.find()
    return NextResponse.json({tension})
}