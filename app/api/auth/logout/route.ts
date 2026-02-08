import {NextResponse} from "next/server"

export async function POST() {
    try {
        const response = NextResponse.json({message:"Başarıyla Çıkış yapıldı"}, {status:200})

        response.cookies.set("token","", {
            httpOnly:true,
            secure: process.env.NODE_ENV==="production",
            expires: new Date(0),
            path:"/",
        })

        return response
    }
    catch (error) {
        return NextResponse.json({error:"Hata oluştu"}, {status:500})
    }
}