import dbConnect from "@/lib/mongodb";
import User from "@/models/User"
import {authSchema} from "@/lib/validation";
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect()

        const body = await req.json()

        // safeparse
        const validation = authSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({
                error: "Geçersiz veri formatı", details: validation.error.format()
            }, {status: 400})
        }

        const {email, password} = validation.data

        // çakışma kontrolü
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return NextResponse.json({
                error: "Bu e-posta mevcut"
            }, {status: 400})
        }

        // şifre hash
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({email, password: hashedPassword})

        return NextResponse.json(
            {message: "Kullanıcı başarıyla oluşturuldu", userId: newUser._id}, {status: 201}
        )
    } catch (error: any) {
        console.error("REGISTER_API_ERROR: ", error)
        return NextResponse.json(
            {error: "Sunucu tarafında hata oluştu"}, {status: 500}
        )
    }
}