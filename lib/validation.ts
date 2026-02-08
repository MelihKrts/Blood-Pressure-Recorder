import * as z from "zod"

export const authSchema = z.object({
    email:z.string().min(1,"En az karakter 1 girilmesi gereklidir.").email().trim(),
    password: z.string().min(6,"6 karakterden az şifre olamaz").max(50,"En fazla")
})

export type AuthSchemaType = z.infer<typeof authSchema>