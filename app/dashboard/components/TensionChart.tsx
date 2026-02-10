"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function TensionChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center border-2 border-dashed rounded-xl bg-slate-50">
                <p className="text-muted-foreground italic">Grafik oluşturmak için veri giriniz.</p>
            </div>
        );
    }

    // Veriyi tarihe göre sırala
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="h-[350px] w-full bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-center md:text-left">
                Tansiyon Analizi
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={sortedData}
                    // 🔥 Taşmayı önlemek için margin ekliyoruz
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => new Date(str).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                        tick={{fontSize: 11, fill: '#64748b'}}
                        dy={10} // Yazıları biraz aşağı kaydırarak eksene yapışmasını önler
                    />
                    <YAxis
                        tick={{fontSize: 11, fill: '#64748b'}}
                        domain={['auto', 'auto']}
                        width={35} // 🔥 Sayıların sığması için sabit genişlik
                    />
                    <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleDateString('tr-TR')}
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            fontSize: '12px'
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        height={36}
                        iconType="circle"
                    />
                    <Line
                        type="monotone"
                        dataKey="systolic"
                        name="Büyük Tansiyon"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="diastolic"
                        name="Küçük Tansiyon"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}