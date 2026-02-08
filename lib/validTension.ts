// import * as z from "zod"
//
// export const authTensionSchema = z.object({
//     systolic: z.coerce.number().min(20, "Girilen değer çok düşük")
//         .max(300, "Girilen değer çok yüksek"),
//     diastolic: z.coerce.number().min(20, "girilem değer çok düşük").max(300, "girilen değer çok yüksek"),
//     pulse: z.coerce.number().min(30, "Nabız çok düşük").max(250, "Nabız çok yüksek"),
//     notes: z.string().max(500, "500 karakterden fazla olamaz.").optional().or(z.literal("")),
//     date: z.string().min(1, "Tarih seçimi zorunludur").refine((val) => {
//         const selectedDate = new Date(val);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         return selectedDate <= today;
//     }, "Gelecek bir tarih seçemezsiniz"),
//     time: z.string().optional().or(z.literal("")),
// }).refine((data) => {
//     // Eğer tarih bugünse, saati kontrol et
//     const todayStr = new Date().toISOString().split("T")[0];
//     if (data.date === todayStr && data.time) {
//         const now = new Date();
//         const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
//         return data.time <= currentTime;
//     }
//     return true;
// }, {
//     message: "Gelecek bir saat seçemezsiniz",
//     path: ["time"]
// }).refine((data) => data.systolic > data.diastolic, {
//     message: "Büyük Tansiyon küçük tansiyondan yüksek olmalıdır.",
//     path: ["systolic"]
// }).strict()
//
// export type TensionSchemaType = z.infer<typeof authTensionSchema>

// lib/validTension.ts
import * as z from "zod"

export const authTensionSchema = z.object({
    systolic: z.coerce.number().min(20).max(300),
    diastolic: z.coerce.number().min(20).max(300),
    pulse: z.coerce.number().min(30).max(250),
    notes: z.string().max(500).optional().or(z.literal("")),
    date: z.string().min(1, "Tarih zorunludur"),
    time: z.string().optional().or(z.literal("")),
}).refine((data) => {
    const time = data.time || "00:00"
    const measuredAt = new Date(`${data.date}T${time}`)
    const now = new Date()

    return measuredAt <= now
}, {
    message: "Gelecek tarih veya saat seçemezsiniz",
    path: ["time"]
}).refine(
    (data) => data.systolic > data.diastolic,
    {
        message: "Büyük tansiyon küçük tansiyondan yüksek olmalıdır",
        path: ["systolic"]
    }
)

export type TensionSchemaType = z.infer<typeof authTensionSchema>
