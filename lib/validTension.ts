import * as z from "zod"

export const authTensionSchema = z.object({
    systolic: z.coerce.number().min(20).max(300),
    diastolic: z.coerce.number().min(20).max(300),
    pulse: z.coerce.number().min(30).max(250),

    notes: z.string().max(500).optional().or(z.literal("")),

    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih formatı (YYYY-MM-DD)"),

    time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Geçersiz saat formatı (HH:mm)")
        .optional()
        .or(z.literal("")),
})
    .refine((data) => {
        const safeTime = data.time && data.time !== "" ? data.time : "00:00"
        const measuredAt = new Date(`${data.date}T${safeTime}:00`)

        return measuredAt <= new Date()
    }, {
        message: "Gelecek tarih veya saat seçemezsiniz",
        path: ["time"]
    })
    .refine(
        (data) => data.systolic > data.diastolic,
        {
            message: "Büyük tansiyon küçük tansiyondan yüksek olmalıdır",
            path: ["systolic"]
        }
    )
    .strict()
