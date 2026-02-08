import {NextResponse} from "next/server";
import dbConnect from "@/lib/mongodb";
import Tension from "@/models/Tension";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import {authTensionSchema} from "@/lib/validTension";

export async function POST(req: Request) {
    // const accept = req.headers.get("accept")
    //
    // if (accept?.includes("text/html")) {
    //     return NextResponse.json(
    //         { error: "Not Found" },
    //         { status: 404 }
    //     )
    // }
    try {
        await dbConnect()

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({error: "Oturum bulunamadı, lütfen tekrar giriş yapın"}, {status: 401})
        }

        const secret = process.env.JWT_SECRET!
        const decoded = jwt.verify(token, secret) as { userId: string };

        const body = await req.json()
        const validation = authTensionSchema.safeParse(body)

        if (!validation.success) {
            const errorMessage = validation.error.issues.map(err => err.message).join(", ")
            return NextResponse.json({error: errorMessage}, {status: 400})
        }
        const {systolic, diastolic, pulse, notes,date,time} = validation.data

        const safeTime = time && time !== "" ? time : "00:00"
        const measuredAt = new Date(`${date}T${safeTime}:00`)

        const newRecord = await Tension.create({
            userId: decoded.userId,
            systolic,
            diastolic,
            pulse,
            notes,
            measuredAt,
            date,
            time:safeTime,
        })

        return NextResponse.json({message: "Kayıt başarılı", data: newRecord}, {status: 201})
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({error: "Oturum geçersiz, lütfen tekrar giriş yapın"}, {status: 401})
        }
        return NextResponse.json({error: "Sunucu hatası"}, {status: 500})
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect()
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json({error: "Bilgi Bulunamadı"}, {status: 401})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const data = await Tension.find({
            userId: decoded.userId,
        }).sort({date:-1, measuredAt: -1})

        return NextResponse.json(data, {status: 200})
    } catch (err) {
        console.log("Veri çekme hatası: ", err)
        return NextResponse.json({error: "Veriler alınamadı"}, {status: 500})
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect()

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { error: "Oturum bulunamadı" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { userId: string }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { error: "ID bulunamadı" },
                { status: 400 }
            )
        }

        // 👇 HEM ID HEM USER KONTROLÜ
        const deleted = await Tension.findOneAndDelete({
            _id: id,
            userId: decoded.userId
        })

        if (!deleted) {
            return NextResponse.json(
                { error: "Kayıt bulunamadı veya yetkiniz yok" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Kayıt silindi" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Silme hatası" },
            { status: 500 }
        )
    }
}


// export async function GET(req: Request) {
//     try {
//         await dbConnect()
//         const data = await Tension.find({})
//         return NextResponse.json(data, {status: 200})
//     } catch (err) {
//         console.log("Veri çekme hatası: ", err)
//         return NextResponse.json({error: "Veriler alınamadı"}, {status: 500})
//     }
// }
//
// export async function DELETE(req: Request) {
//     try {
//         await dbConnect()
//         const {searchParams} = new URL(req.url)
//         const id = searchParams.get("id")
//         if (!id) {
//             return NextResponse.json({error: "ID Bulunamadı"}, {status: 400})
//         }
//         await Tension.findByIdAndDelete(id)
//         return NextResponse.json({message: "Kayıt başarıyla silindi"}, {status: 200})
//     } catch (error) {
//         return NextResponse.json({error: "Silme hatası"}, {status: 500})
//     }
// }