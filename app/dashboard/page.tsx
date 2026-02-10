"use client"
import { useState } from "react"
import { useTensions } from "@/hooks/useTensions"
import { DashBoardHeader } from "@/app/dashboard/components/DashboardHeader"
import { StatsCards } from "@/app/dashboard/components/StatsCards"
import { TensionList } from "@/app/dashboard/components/TensionList"
import { TensionForm } from "@/app/dashboard/components/TensionForm"
import { TensionChart } from "@/app/dashboard/components/TensionChart"
import { EditTensionModal } from "@/app/dashboard/components/EditTensionModal"
import { exportToPDF, exportToCSV, exportToDoc } from "@/lib/export-utils"
import { FileDown, FileText, Table as TableIcon } from "lucide-react"

export default function DashboardPage() {
    const { tensions, fetchTensions, deleteTension } = useTensions()
    const [editOpen, setEditOpen] = useState(false)
    const [selectedTension, setSelectedTension] = useState<any>(null)

    const handleEdit = (tension: any) => {
        setSelectedTension(tension)
        setEditOpen(true)
    }

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Çıkış yapılırken hata oluştu", error);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <DashBoardHeader onLogout={handleLogout} />

            <StatsCards tensions={tensions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TensionChart data={tensions} />
                </div>
                <TensionForm onSuccess={fetchTensions} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6">
                <h2 className="text-xl font-bold text-slate-800">Geçmiş Kayıtlar</h2>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => exportToPDF(tensions)} className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition shadow-sm text-sm">
                        <FileText size={16} /> PDF
                    </button>
                    <button onClick={() => exportToDoc(tensions)} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm text-sm">
                        <FileDown size={16} /> DOC
                    </button>
                    <button onClick={() => exportToCSV(tensions)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm text-sm">
                        <TableIcon size={16} /> CSV
                    </button>
                </div>
            </div>

            <TensionList tensions={tensions} onDelete={deleteTension} onEdit={handleEdit} />

            {selectedTension && (
                <EditTensionModal
                    open={editOpen}
                    tension={selectedTension}
                    onClose={() => { setEditOpen(false); setSelectedTension(null); }}
                    onUpdated={fetchTensions}
                />
            )}
        </div>
    )
}