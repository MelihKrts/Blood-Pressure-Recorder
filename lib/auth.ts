import jwt from "jsonwebtoken"
import {cookies} from "next/headers"

export async function getAuthUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if(!token) {
        throw new Error("UNAUTHORIZED")
    }

    const secret = process.env.JWT_SECRET
    if(!secret) {
        throw new Error("JWT_SECRET_MISSING")
    }
    return  jwt.verify(token,secret) as {userId: string}
}