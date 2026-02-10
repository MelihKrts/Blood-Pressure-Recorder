import { TensionRecord } from "@/types/Tension"
import { Button } from "@/components/ui/button"
import { Calendar, Activity, StickyNote, Trash2, Edit3 } from "lucide-react"

interface TensionListProps {
    tensions: TensionRecord[]
    onDelete: (id: string) => void
    onEdit: (tension: TensionRecord) => void
}

export function TensionList({ tensions, onDelete, onEdit }: TensionListProps) {
    if (tensions.length === 0) return <div className="p-10 text-center border-2 border-dashed rounded-xl text-slate-400">Henüz kayıtlı ölçüm bulunamadı.</div>;

    const sorted = [...tensions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Tıbbi seviyelere göre renk ve metin belirleme
    const getStatusDetails = (sys: number, dia: number) => {
        if (sys >= 160 || dia >= 100) return "text-red-700 border-red-300 bg-red-50"; // Evre 2
        if (sys >= 140 || dia >= 90) return "text-red-500 border-red-200 bg-red-50";  // Evre 1
        if (sys >= 130 || dia >= 85) return "text-amber-600 border-amber-200 bg-amber-50"; // Yüksek Normal
        if (sys < 120 && dia < 80) return "text-blue-600 border-blue-200 bg-blue-50"; // Optimal
        return "text-emerald-600 border-emerald-200 bg-emerald-50"; // Normal
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2 text-slate-700 flex justify-between items-center">
                Geçmiş Ölçümler
                <span className="text-xs font-normal text-slate-400">{tensions.length} Kayıt</span>
            </h3>

            {sorted.map(item => {
                const statusClasses = getStatusDetails(item.systolic, item.diastolic);

                return (
                    <div key={item._id} className="p-4 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-white hover:shadow-md transition-all gap-4">

                        {/* Sol Taraf: Ölçüm Değerleri ve Bilgiler */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4">
                                <div className={`px-4 py-2 rounded-lg border-2 min-w-[120px] text-center ${statusClasses}`}>
                                    <span className="text-3xl font-black tracking-tighter">
                                        {item.systolic}<span className="opacity-30 mx-1">/</span>{item.diastolic}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">mmHg</div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                                        <Calendar size={12} /> {new Date(item.date).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-3">
                                {item.pulse && (
                                    <div className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                                        <Activity size={14}/> {item.pulse} <span className="text-[10px] opacity-70 ml-1">BPM</span>
                                    </div>
                                )}
                                {item.notes && (
                                    <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex-1 min-w-[200px]">
                                        <StickyNote size={14} className="mt-1 text-slate-400 shrink-0"/>
                                        <p className="text-xs leading-relaxed">{item.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sağ Taraf: İşlem Butonları */}
                        <div className="flex md:flex-col lg:flex-row gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-9 border-blue-200 text-blue-600 hover:bg-blue-50 gap-1"
                                onClick={() => onEdit(item)}
                            >
                                <Edit3 size={14} /> Güncelle
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="flex-1 h-9 text-red-400 hover:text-red-600 hover:bg-red-50 gap-1"
                                onClick={() => onDelete(item._id)}
                            >
                                <Trash2 size={14} /> Sil
                            </Button>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}