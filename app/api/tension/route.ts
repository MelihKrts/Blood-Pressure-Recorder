import { withDB } from "@/lib/withDB";
import { getAuthUser } from "@/lib/auth";
import Tension from "@/models/Tension";
import { error, ok } from "@/lib/apiResponse";
import { authTensionSchema } from "@/lib/validTension";

export async function POST(req: Request) {
    return withDB(async () => {
        try {
            const { userId } = await getAuthUser();
            const body = await req.json();

            const parsed = authTensionSchema.safeParse(body);
            if (!parsed.success) {
                return error(parsed.error.issues.map(i => i.message).join(", "), 400);
            }

            // Mongoose'un patlamaması için veriyi temizle
            const finalData = {
                userId,
                systolic: parsed.data.systolic,
                diastolic: parsed.data.diastolic,
                date: parsed.data.date,
                notes: parsed.data.notes || "",
                // Pulse boş string ise null veya undefined gönder
                pulse: (parsed.data.pulse === "" || parsed.data.pulse === null) ? undefined : Number(parsed.data.pulse)
            };

            const record = await Tension.create(finalData);
            return ok({ message: "Kayıt Başarılı", data: record }, 201);
        } catch (e: any) {
            console.error("POST ERROR DETAILS:", e); // Terminale bakmayı unutma!
            return error(e.message || "Sunucu Hatası", 500);
        }
    });
}

export async function GET() {
    return withDB(async () => {
        try {
            const { userId } = await getAuthUser();
            const data = await Tension.find({ userId }).sort({ date: -1 });
            return ok(data);
        } catch {
            return error("Veriler Alınamadı", 500);
        }
    });
}

export async function PUT(req: Request) {
    return withDB(async () => {
        try {
            const { userId } = await getAuthUser();
            const id = new URL(req.url).searchParams.get("id");
            const body = await req.json();

            const parsed = authTensionSchema.safeParse(body);
            if (!parsed.success) return error("Geçersiz veri", 400);

            const updateData = {
                ...parsed.data,
                pulse: (parsed.data.pulse === "" || parsed.data.pulse === null) ? undefined : Number(parsed.data.pulse)
            };

            const updated = await Tension.findOneAndUpdate(
                { _id: id, userId },
                updateData,
                { new: true }
            );

            if (!updated) return error("Kayıt bulunamadı", 404);
            return ok({ message: "Güncellendi", data: updated });
        } catch (e: any) {
            console.error("PUT ERROR:", e);
            return error("Güncelleme Hatası", 500);
        }
    });
}

export async function DELETE(req: Request) {
    return withDB(async () => {
        try {
            const { userId } = await getAuthUser();
            const id = new URL(req.url).searchParams.get("id");
            await Tension.findOneAndDelete({ _id: id, userId });
            return ok({ message: "Silindi" });
        } catch {
            return error("Silme hatası", 500);
        }
    });
}