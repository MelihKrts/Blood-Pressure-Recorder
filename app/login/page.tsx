"use client"
import React, { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/app/component/auth/AuthForm"
import { authSchema } from "@/lib/validation"
import { toast } from "react-toastify"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
    const router = useRouter()

    // Zamanlayıcıyı takip etmek için ref
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Component kapandığında zamanlayıcıyı temizle
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleEmailChange = (val: string) => {
        setEmail(val);
        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = authSchema.safeParse({ email, password })

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors
            setErrors({
                email: formattedErrors.email?.[0],
                password: formattedErrors.password?.[0],
            })
            toast.error("Lütfen formdaki hataları düzeltin.")
            return
        }

        setErrors({})
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            const msg = error.message.includes("phone") ? "E-posta veya şifre hatalı" : error.message
            toast.error(msg)
            setLoading(false) // Hata varsa butonu tekrar aktif et
        } else {
            toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")

            // 3 saniye sonra yönlendir ve ref'e kaydet
            timerRef.current = setTimeout(() => {
                router.push("/addTension")
            }, 3000)

            // Not: setLoading(false) yapmıyoruz ki yönlendirme süresince buton 'loading' kalsın.
        }
    }

    return (
        <AuthForm
            title="Giriş Yap"
            buttonText="Giriş Yap"
            loading={loading}
            linkText="Hesabın yok mu? Kayıt ol"
            linkHref="/register"
            email={email}
            setEmail={handleEmailChange}
            password={password}
            setPassword={handlePasswordChange}
            onSubmit={handleSignIn}
            errors={errors}
        />
    )
}