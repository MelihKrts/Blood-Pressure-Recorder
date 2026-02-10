import dbConnect from "@/lib/mongodb";

export async function withDB<T>(fn:()=>Promise<T>) {
    await dbConnect()
    return fn()
}