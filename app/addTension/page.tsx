"use client"
import React, { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Edit2, X, FileText, Download } from "lucide-react" // Yeni ikonlar
import { toast } from "react-toastify"
import { exportToPDF, exportToDoc } from "@/lib/exportUtils";

interface Reading {
    id: string;
    systolic: number;
    diastolic: number;
    pulse: number;
    created_at: string;
}

export default function AddTensionPage() {
    const [values, setValues] = useState({ systolic: "", diastolic: "", pulse: "" })
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [readings, setReadings] = useState<Reading[]>([])

    const [editingId, setEditingId] = useState<string | null>(null);

    const router = useRouter()

    const fetchReadings = useCallback(async () => {
        const { data, error } = await supabase
            .from("readings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) toast.error("Veriler alınamadı");
        else setReadings(data || []);
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) router.push("/login")
            else {
                setUserName(session.user.email ?? "Kullanıcı")
                fetchReadings();
            }
        }
        getSession()
    }, [router, fetchReadings])

    const startEdit = (reading: Reading) => {
        setEditingId(reading.id);
        setValues({
            systolic: reading.systolic.toString(),
            diastolic: reading.diastolic.toString(),
            pulse: reading.pulse ? reading.pulse.toString() : ""
        });

        // Add this guard
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setValues({ systolic: "", diastolic: "", pulse: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Oturum bulunamadı.");
            setLoading(false);
            return;
        }

        const payload = {
            systolic: parseInt(values.systolic),
            diastolic: parseInt(values.diastolic),
            pulse: values.pulse ? parseInt(values.pulse) : null,
        };

        if (editingId) {
            const { error: updateError } = await supabase
                .from("readings")
                .update(payload)
                .match({ id: editingId, user_id: user.id }); // Hem ID hem UserID kontrolü

            if (updateError) {
                toast.error("Güncelleme hatası: " + updateError.message);
            } else {
                toast.success("Kayıt başarıyla güncellendi!");
                cancelEdit();
                fetchReadings();
            }
        } else {
            // YENİ KAYIT İŞLEMİ
            const { error: insertError } = await supabase
                .from("readings")
                .insert([{ ...payload, user_id: user.id }]);

            if (insertError) {
                toast.error("Kayıt hatası: " + insertError.message);
            } else {
                toast.success("Başarıyla kaydedildi!");
                setValues({ systolic: "", diastolic: "", pulse: "" });
                fetchReadings();
            }
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from("readings").delete().eq("id", id);
        if (error) toast.error("Silme başarısız");
        else {
            toast.success("Kayıt silindi.");
            fetchReadings();
        }
    }

    return (
        <div className="p-4 max-w-xl mx-auto space-y-6">
            <div className="flex justify-between items-center mt-8">
                <p className="text-sm text-muted-foreground">Hoş geldin, <b>{userName}</b></p>
                <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}>Çıkış</Button>
            </div>

            <Card className={editingId ? "border-blue-500 ring-1 ring-blue-500" : ""}>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        {editingId ? "Kaydı Düzenle" : "Tansiyon Kaydı Ekle"}
                        {editingId && <Button variant="ghost" size="sm" onClick={cancelEdit}><X className="h-4 w-4 mr-1"/> İptal</Button>}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Büyük Tansiyon</Label>
                                <Input type="number" required value={values.systolic} onChange={(e) => setValues({...values, systolic: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <Label>Küçük Tansiyon</Label>
                                <Input type="number" required value={values.diastolic} onChange={(e) => setValues({...values, diastolic: e.target.value})}/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Nabız</Label>
                            <Input type="number" value={values.pulse} onChange={(e) => setValues({...values, pulse: e.target.value})}/>
                        </div>
                        <Button className={`w-full ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`} type="submit" disabled={loading}>
                            {loading ? "İşlem yapılıyor..." : editingId ? "Değişiklikleri Kaydet" : "Veriyi Kaydet"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => exportToPDF(readings)}>
                    <FileText className="mr-2 h-4 w-4"/> PDF
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => exportToDoc(readings)}>
                    <Download className="mr-2 h-4 w-4"/> DOC
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Geçmiş Kayıtlar</h3>
                {readings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Henüz kayıt bulunamadı.</p>
                ) : (
                    readings.map((item) => (
                        <Card key={item.id} className={editingId === item.id ? "opacity-50" : ""}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xl font-bold text-red-600">
                                        {item.systolic} / {item.diastolic}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Nabız: {item.pulse || "--"} | {new Date(item.created_at).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-600" onClick={() => startEdit(item)}>
                                        <Edit2 className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}