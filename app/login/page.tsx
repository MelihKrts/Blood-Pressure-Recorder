"use client"
import React, { useState, useRef, useEffect } from "react"
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

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(result.data)
            })
            const data = await res.json()

            if(!res.ok) {
                toast.error(data.error || "Giriş yapılamadı")
                setLoading(false)
                return
            }
            toast.success("Giriş başarılı yönlendiriliyorsunux")
            timerRef.current = setTimeout(()=> {
                router.push("/dashboard")
            },2000)
        } catch(error) {
            toast.error("Bir hata oluştu")
            setLoading(false)
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