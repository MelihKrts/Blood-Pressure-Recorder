import * as z from "zod";

export const authTensionSchema = z.object({
    systolic: z.coerce.number().min(20,"Girilecek sayı 20'ye eşit veya daha büyük olmalıdır").max(300,"Değer en fazla 300 olmalıdır"),
    diastolic: z.coerce.number().min(20,"Girilecek sayı 20'ye eşit veya daha büyük olmalıdır").max(300,"Değer en fazla 300 olmalıdır"),
    pulse: z.union([z.coerce.number(), z.literal(""), z.null()]).optional(),
    notes: z.string().max(500,"Not en fazla 500 karakter olabilir").optional().default(""),
    date: z.string().min(1, "Tarih gereklidir"),
}).refine((data) => data.systolic > data.diastolic, {
    message: "Büyük tansiyon küçük tansiyondan yüksek olmalıdır",
    path: ["systolic"]
});