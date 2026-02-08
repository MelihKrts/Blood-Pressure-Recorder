"use client"

import React, {useEffect, useState} from "react";
import {FormField} from "@/app/component/shared/FormField";
import {Button} from "@/components/ui/button";
import {toast} from "react-toastify";
import {authTensionSchema} from "@/lib/validTension";

interface TensionRecord {
    _id: string;
    systolic: number;
    diastolic: number;
    pulse: number;
    notes?: string;
    measuredAt: string;
    createdAt: string;
}

const getGreeting = () => {
    const hour = new Date().getHours();
    switch (true) {
        case (hour >= 6 && hour < 12):
            return "Günaydın";
        case(hour >= 12 && hour < 18):
            return "Tünaydın";
        case (hour >= 18 && hour < 23) :
            return "İyi Akşamlar";
        default:
            return "İyi Geceler"
    }
}

export default function DashboardPage() {
    const [tensions, setTensions] = useState<TensionRecord[]>([])
    const [greeting,setGreeting] = useState(getGreeting())
    const [errors, setErrors] = useState<Record<string,string>>({})


    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTime = e.target.value

        // bugün mü?
        if (formData.date === getTodayString()) {
            const now = getCurrentTimeString()

            // 🚫 gelecek saat
            if (selectedTime > now) {
                return // state güncellenmez → UI bloke
            }
        }

        setFormData({ ...formData, time: selectedTime })
    }


    useEffect(() => {
        const timer = setInterval(()=> {
            const currentGreeting = getGreeting()
            if(currentGreeting !== greeting) {
                setGreeting(currentGreeting)
            }
        },60000)

        return () => clearInterval(timer)
    }, [greeting]);

    const fetchTension = async () => {
        try {
            const res = await fetch("/api/tension")
            const data = await res.json()
            if (res.ok) {
                setTensions(data)
            }
        } catch (error) {
            console.log("Veri Yükleme hatası", error)
            toast.error("Hata oluştu")
        }
    }

    const getTodayString = () => new Date().toISOString().split("T")[0]

    const getCurrentTimeString = () => {
        const now = new Date()
        return now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    }

    const lastMeasurement = tensions[0]
    const maxSystolic = tensions.length > 0 ? Math.max(...tensions.map((t: any) => t.systolic)) : 0;

    useEffect(() => {
        fetchTension()
    }, []);

    const [formData, setFormData] = useState({
        systolic: "",
        diastolic: "",
        pulse: "",
        notes: "",
        date:new Date().toISOString().split("T")[0],
        time:"",
    })

    useEffect(() => {
        if (!formData.time) return

        if (formData.date === getTodayString()) {
            const now = getCurrentTimeString()
            if (formData.time > now) {
                setFormData((prev) => ({
                    ...prev,
                    time: now,
                }))
            }
        }
    }, [formData.date])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const result = authTensionSchema.safeParse(formData)

        if(!result.success) {
            const newErrors : Record<string,string> = {}
            result.error.issues.forEach((issue)=> {
                issue.path[0]
                const fieldName = issue.path[0] as string
                newErrors[fieldName] = issue.message
            })
            setErrors(newErrors)
            return

        }

        try {
            const res = await fetch("/api/tension", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Bir hata oluştu")
            }
            toast.success("Kayıt başarıyla eklendi!")

            setErrors({})
            setFormData({systolic: "", diastolic: "", pulse: "", notes: "", date:new Date().toISOString().split("T")[0], time: ""})
            fetchTension()
        } catch (err: any) {
            toast.error(err.message || "Bir hata oluştu")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğinden emin misiniz?")) return
        try {
            const res = await fetch(`/api/tension?id=${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Kayıt başarıyla silindi.")
                fetchTension()
            } else {
                throw new Error("Silinemedi")
            }
        } catch (error) {
            toast.error("Silme işlemi başarısız")
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            })
            if(response.ok) {
                toast.success("Çıkış başarılı")
                window.location.href = "/login"
            }
            else {
                throw new Error("Oturum kapatılamadı")
            }
        } catch (error) {
            toast.error("Bir sorun oluştu")
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Üst Kısım: Selamlama */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {greeting}
                </h1>
                <div className="text-sm text-gray-500">{new Date().toLocaleDateString('tr-TR')}</div>

                <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors">Çıkış Yap</Button>

            </div>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                    <p className="text-sm text-blue-600 font-medium">Son Ölçüm</p>
                    <h3 className="text-2xl font-bold">
                        {lastMeasurement ? `${lastMeasurement.systolic}/${lastMeasurement.diastolic}` : "--"}
                        <span className="text-xs ml-1 text-gray-500">mmHg</span>
                    </h3>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                    <p className="text-sm text-red-600 font-medium">Haftalık En Yüksek</p>
                    <h3 className="text-2xl font-bold">
                        {maxSystolic > 0 ? maxSystolic : "--"}
                        <span className="text-xs ml-1 text-gray-500">mmHg</span>
                    </h3>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-sm text-green-600 font-medium">Toplam Kayıt</p>
                    <h3 className="text-2xl font-bold">{tensions.length}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Taraf: Grafik veya Liste Gelebilir (Gelecek planı için boşluk) */}
                <div
                    className="lg:col-span-2 bg-gray-50 rounded-xl p-4 min-h-[300px] flex items-center justify-center border-dashed border-2 border-gray-200">
                    <p className="text-gray-400 font-medium">[ Buraya Grafik Gelecek ]</p>
                </div>

                {/* Sağ Taraf: Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Hızlı Kayıt Ekle</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField id="systolic" label="Büyük (Sistolik)" type="number" value={formData.systolic}
                                       onChange={(e) => setFormData({...formData, systolic: e.target.value})} error={errors.systolic} required/>
                            <FormField id="diastolic" label="Küçük (Diyastolik)" type="number"
                                       value={formData.diastolic}
                                       onChange={(e) => setFormData({...formData, diastolic: e.target.value})} error={errors.diastolic}
                                       required/>
                        </div>
                        <FormField id="pulse" label="Nabız" type="number" value={formData.pulse}
                                   onChange={(e) => setFormData({...formData, pulse: e.target.value})} required error={errors.pulse}/>
                        <FormField id="notes" label="Notlar" type="text" value={formData.notes}
                                   onChange={(e) => setFormData({...formData, notes: e.target.value})} />

                        <FormField id="date" label="Ölçüm Tarihi" type="date" value={formData.date} onChange={(e)=> setFormData({...formData, date: e.target.value})}  error={errors.date} required max={getTodayString()} />

                        <FormField
                            id="time"
                            label="Ölçüm Saati"
                            type="time"
                            value={formData.time}
                            onChange={handleTimeChange}
                            error={errors.time}
                            step="60"
                            max={
                                formData.date === getTodayString()
                                    ? getCurrentTimeString()
                                    : undefined
                            }
                        />




                        <Button type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all">
                            Kaydet
                        </Button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">Geçmiş Ölçümler</h2>
                <div className="space-y-3">
                    {tensions.length === 0 ? (
                        <p className="text-gray-500 text-sm">Henüz kayıt bulunamadı.</p>
                    ) : (
                        tensions.map((item: any) => (
                            <div key={item._id} className="border-b pb-2 last:border-0">
                                <div className="flex justify-between font-medium">
                                    <span>{item.systolic}/{item.diastolic} mmHg</span>
                                    <span className="text-blue-600">{item.pulse} BPM</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Ölçüm Tarihi:{" "}
                                    {new Date(item.measuredAt).toLocaleDateString("tr-TR")}
                                    {" | Saat: "}
                                    {new Date(item.measuredAt).toLocaleTimeString("tr-TR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>

                                <p className="text-[11px] text-gray-300">
                                    Kaydedilme: {new Date(item.createdAt).toLocaleString("tr-TR")}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {item.notes}
                                </p>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold p-2"
                                >
                                    Sil
                                </button>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}