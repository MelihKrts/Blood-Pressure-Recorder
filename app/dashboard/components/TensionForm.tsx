"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { authTensionSchema } from "@/lib/validTension"
import { FormField } from "@/app/component/shared/FormField"

export function TensionForm({ mode = "create", initialData, onSuccess }: any) {
    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({ systolic: "", diastolic: "", pulse: "", notes: "", date: today });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const parsed = authTensionSchema.safeParse(form);
        if (parsed.success) { setErrors({}); }
        else {
            const fieldErrors: any = {};
            parsed.error.issues.forEach(i => { if (errors[i.path[0]]) fieldErrors[i.path[0]] = i.message; });
            if (Number(form.systolic) > Number(form.diastolic)) delete fieldErrors.systolic;
            setErrors(fieldErrors);
        }
    }, [form]);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setForm({
                systolic: String(initialData.systolic),
                diastolic: String(initialData.diastolic),
                pulse: String(initialData.pulse ?? ""),
                notes: initialData.notes ?? "",
                date: initialData.date?.split("T")[0] ?? today
            });
        }
    }, [mode, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = authTensionSchema.safeParse(form);
        if (!parsed.success) {
            const errs: any = {};
            parsed.error.issues.forEach(i => errs[i.path[0]] = i.message);
            setErrors(errs); return;
        }
        try {
            setLoading(true);
            const res = await fetch(mode === "create" ? "/api/tension" : `/api/tension?id=${initialData._id}`, {
                method: mode === "create" ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });
            if (!res.ok) throw new Error();
            toast.success("Başarılı!");
            if (mode === "create") setForm({ systolic: "", diastolic: "", pulse: "", notes: "", date: today });
            onSuccess();
        } catch { toast.error("Hata oluştu"); } finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 border rounded-2xl bg-white shadow-lg space-y-4">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">{mode === "create" ? "Yeni Ölçüm" : "Güncelle"}</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField id="systolic" name="systolic" label="Büyük" type="number" maxLength={3} value={form.systolic} onChange={e => setForm({...form, systolic: e.target.value})} error={errors.systolic} />
                <FormField id="diastolic" name="diastolic" label="Küçük" type="number" maxLength={3} value={form.diastolic} onChange={e => setForm({...form, diastolic: e.target.value})} error={errors.diastolic} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField id="pulse" name="pulse" label="Nabız" type="number" maxLength={3} value={form.pulse} onChange={e => setForm({...form, pulse: e.target.value})} error={errors.pulse} />
                <FormField id="date" name="date" label="Tarih" type="date" max={today} value={form.date} onChange={e => setForm({...form, date: e.target.value})} error={errors.date} />
            </div>
            <div className="space-y-1">
                <Label className="text-sm font-semibold">Notlar ({form.notes.length}/500)</Label>
                <Textarea maxLength={500} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="rounded-xl min-h-[100px]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-6 rounded-xl font-bold">{loading ? "İşleniyor..." : "Kaydet"}</Button>
        </form>
    );
}