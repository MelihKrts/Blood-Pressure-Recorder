import dbConnect from "@/lib/mongodb";
import User from "@/models/User"
import {authSchema} from "@/lib/validation";
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()
        const validation = authSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({error: "Geçersiz format"}, {status: 400})
        }

        const {email, password} = validation.data
        const user = await User.findOne({email})
        if (!user) {
            return NextResponse.json({error: "E-posta veya şifre hatalı"}, {status: 401})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return NextResponse.json({error: "E-posta veya Şifre hatalı"}, {status: 401})
        }

        const secret = process.env.JWT_SECRET

        if(!secret) {
            throw new Error("JWT_SECRET not found")
        }

        const token = jwt.sign({userId: user._id}, secret,  {expiresIn: "7d"})

        const response = NextResponse.json({message: "Giriş başarılı"}, {status: 200})

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            sameSite:"lax",
            path: "/",
        })

        return response
    } catch (error) {
        return NextResponse.json({error: "Sunucu hatası"}, {status: 500})
    }
}