import connectMongoDB from "../../../libs/mongodb";
import Tension from "../../../models/tension";
import {NextResponse} from "next/server";

export async function POST(request) {
    const {bigTension, smallTension, selectedDate, pulse} = await request.json()
    console.log("Received Data:", { bigTension, smallTension, selectedDate, pulse });

    await connectMongoDB()
    await Tension.create({bigTension, smallTension, selectedDate, pulse})
    return NextResponse.json({message: "Successfully created tension"}, {status: 201})
}

export async function GET() {
    await connectMongoDB()
    const tension = await Tension.find()
    return NextResponse.json({tension})
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Tension.findByIdAndDelete(id)
    return NextResponse.json({message: "Tension data deleted successfully"}, {status: 200})
}