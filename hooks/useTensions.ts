"use client"
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {TensionRecord} from "@/types/Tension";

export function useTensions() {
    const [tensions, setTensions] = useState<TensionRecord[]>([])
    const [loading, setLoading] = useState(false)

    const fetchTensions = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/tension")
            const data = await res.json()
            if (res.ok) setTensions(data)
        } catch (error) {
            toast.error("Veriler yüklenemedi")
            setLoading(false)
        }
    }

    const deleteTension = async (id: string) => {
        if (!confirm("Bu kaydı silmek istiyor musunuz")) return
        const res = await fetch(`/api/tension?id=${id}`, {method: "DELETE"})
        if (res.ok) {
            toast.success("Kayıt Silindi")
            fetchTensions()
        } else {
            toast.error("Silinemedi")
        }
    }

    useEffect(() => {
        fetchTensions()
    }, []);

    return {
        tensions,
        loading,
        fetchTensions,
        deleteTension,
    }
}