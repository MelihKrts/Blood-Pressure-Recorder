import * as z from "zod"

export const authTensionSchema = z.object({
    systolic: z.coerce.number().min(20).max(300),
    diastolic: z.coerce.number().min(20).max(300),
    pulse: z.coerce.number().min(30).max(250),

    notes: z.string().max(500).optional().or(z.literal("")),

    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((val) => {
            const today = new Date().toISOString().split("T")[0]
            return val <= today
        }, "Gelecek tarih seçemezsiniz"),

    time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional()
        .or(z.literal("")),
})
    .refine(
        (data) => data.systolic > data.diastolic,
        {
            message: "Büyük tansiyon küçük tansiyondan yüksek olmalıdır",
            path: ["systolic"]
        }
    )
    .strict()
