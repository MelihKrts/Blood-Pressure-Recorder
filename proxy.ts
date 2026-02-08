import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value
    const {pathname} = request.nextUrl

    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (pathname === "/api") {
        return NextResponse.json({error: "Bu İçeriği görüntüleme izniniz yok"}, {status: 403})
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}