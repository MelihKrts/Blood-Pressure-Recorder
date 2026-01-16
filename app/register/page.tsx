"use client"
import React, { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/app/component/auth/AuthForm"
import { authSchema } from "@/lib/validation"
import { toast } from "react-toastify"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
    const router = useRouter()

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleEmailChange = (val: string) => {
        setEmail(val);
        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = authSchema.safeParse({ email, password });

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: formattedErrors.email?.[0],
                password: formattedErrors.password?.[0],
            });
            toast.error("Lütfen formdaki hataları düzeltin")
            return;
        }

        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.")

            timerRef.current = setTimeout(() => {
                router.push("/login")
            }, 3000)
        }
    }

    return (
        <AuthForm
            title="Yeni Hesap Oluştur"
            buttonText="Kayıt Ol"
            loading={loading}
            linkText="Zaten hesabın var mı? Giriş yap"
            linkHref="/login"
            email={email}
            setEmail={handleEmailChange}
            password={password}
            setPassword={handlePasswordChange}
            onSubmit={handleSignUp}
            errors={errors}
        />
    )
}