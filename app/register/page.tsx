"use client"

import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation"
import {AuthForm} from "@/app/component/auth/AuthForm";
import {authSchema} from "@/lib/validation";
import {toast} from "react-toastify";

export default function RegisterPage() {
    const [formData, setFormData] = useState({email: "", password: ""})
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
    const router = useRouter()
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, []);

    const handleChange = (field: "email" | "password", val: string) => {
        setFormData(prev => ({...prev, [field]: val}))
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}))
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = authSchema.safeParse(formData)

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: formattedErrors.email?.[0],
                password: formattedErrors.password?.[0],
            })
            toast.error("Lütfen formu kontrol edin")
            return
        }
        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || "Bir hata oluştu")
                setLoading(false)
                return
            }
            toast.success("Kayıt başarılı yönlendiriliyorsunuz.")

            timerRef.current = setTimeout(() => {
                router.push("/login")

            }, 2000)
        } catch (error) {
            toast.error("Sunuucya bağlanılamadı")
            setLoading(false)
        }
    }

    return (
        <AuthForm
            title="Yeni Hesap Oluştur"
            buttonText="Kayıt Ol"
            loading={loading}
            linkText="Zaten hesabın var mı? Giriş yap"
            linkHref="/login"
            email={formData.email}
            setEmail={(val) => handleChange("email", val)}
            password={formData.password}
            setPassword={(val) => handleChange("password", val)}
            onSubmit={handleSignUp}
            errors={errors}
            minLength={1}
            maxLength={50}
        />
    )
}