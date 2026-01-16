import {z} from "zod"

export const authSchema = z.object({
    email:z.string().min(1,"E-posta zorunludur").email("Geçerli bir e-posta giriniz"),
    password:z.string().min(6,"Şifre en az 6 karakter olmalıdır.")
})