import { TensionRecord } from "@/types/Tension";

export function StatsCards({ tensions }: { tensions: TensionRecord[] }) {
    const last = tensions[0];
    const maxSystolic = tensions.length > 0 ? Math.max(...tensions.map((t) => t.systolic)) : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mavi Tema */}
            <Card
                title="Son Ölçüm"
                value={last ? `${last.systolic}/${last.diastolic}` : "--"}
                unit="mmHg"
                bgColor="bg-blue-50"
                borderColor="border-blue-100"
                titleColor="text-blue-600"
            />
            {/* Turuncu/Kırmızı Tema */}
            <Card
                title="En Yüksek"
                value={maxSystolic ?? "--"}
                unit="mmHg"
                bgColor="bg-orange-50"
                borderColor="border-orange-100"
                titleColor="text-orange-600"
            />
            {/* Yeşil Tema */}
            <Card
                title="Toplam Kayıt"
                value={tensions.length}
                unit="Adet"
                bgColor="bg-emerald-50"
                borderColor="border-emerald-100"
                titleColor="text-emerald-600"
            />
        </div>
    );

    function Card({ title, value, unit, bgColor, borderColor, titleColor }: any) {
        return (
            <div className={`p-4 rounded-xl border shadow-sm ${bgColor} ${borderColor}`}>
                <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">
                    {value} <span className="text-xs font-normal text-gray-500">{unit}</span>
                </h3>
            </div>
        );
    }
}