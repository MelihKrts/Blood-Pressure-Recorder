import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

// Yardımcı fonksiyon: Veri kontrolü
const isDataEmpty = (data: any[]) => {
    if (!data || data.length === 0) {
        toast.error("İndirilecek veri bulunamadı!");
        return true;
    }
    return false;
};



export const exportToPDF = (tensions: any[]) => {
    if (isDataEmpty(tensions)) return;

    const doc = new jsPDF();

    // Verileri tarihe göre sıralayalım (Eskiden yeniye)
    const sorted = [...tensions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Renk yardımcıları (TypeScript Tuple hatasını önlemek için 'as RGB')
    type RGB = [number, number, number];
    const COLORS = {
        DANGER: [185, 28, 28] as RGB, // Evre 2-3
        HIGH: [220, 38, 38] as RGB,   // Evre 1
        WARN: [217, 119, 6] as RGB,   // Sinirda
        NORMAL: [5, 150, 105] as RGB, // Normal
        TEXT: [31, 41, 55] as RGB
    };

    autoTable(doc, {
        startY: 20,
        // Türkçe karakter sorununu önlemek için başlıkları güvenli yazdık
        head: [['Tarih', 'Buyuk', 'Kucuk', 'Nabiz', 'Notlar']],
        body: sorted.map(t => [
            t.date ? new Date(t.date).toLocaleDateString('tr-TR') : '-',
            t.systolic,
            t.diastolic,
            t.pulse || '-',
            t.notes || '' // Durum yerine Notlar geri geldi
        ]),
        styles: { font: "helvetica", fontSize: 9 },
        headStyles: { fillColor: [51, 65, 85], fontStyle: 'bold' },

        didParseCell: (data) => {
            if (data.section === 'body') {
                const sys = Number(data.row.cells[1].raw);
                const dia = Number(data.row.cells[2].raw);

                // Sadece Büyük ve Küçük Tansiyon sütunlarını (index 1 ve 2) renklendir
                if (data.column.index === 1 || data.column.index === 2) {
                    if (sys >= 160 || dia >= 100) {
                        data.cell.styles.textColor = COLORS.DANGER;
                        data.cell.styles.fontStyle = 'bold';
                    } else if (sys >= 140 || dia >= 90) {
                        data.cell.styles.textColor = COLORS.HIGH;
                        data.cell.styles.fontStyle = 'bold';
                    } else if (sys >= 130 || dia >= 85) {
                        data.cell.styles.textColor = COLORS.WARN;
                    } else {
                        data.cell.styles.textColor = COLORS.NORMAL;
                    }
                }
            }
        },
        didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                "Kirmizi: Yuksek, Turuncu: Sinirda, Yesil: Normal. (mmHg)",
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
            );
        }
    });

    const fileName = `tansiyon-raporu-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

// Yardımcı fonksiyon: Durum metni için
const getTensionStatusText = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 100) return "Yüksek (Evre 2)";
    if (sys >= 140 || dia >= 90) return "Yüksek (Evre 1)";
    if (sys >= 130 || dia >= 85) return "Yüksek Normal";
    if (sys >= 120 || dia >= 80) return "Normal";
    return "Optimal";
};

export const exportToCSV = (tensions: any[]) => {
    if (isDataEmpty(tensions)) return;

    const data = tensions.map(t => ({
        Tarih: t.date ? new Date(t.date).toLocaleDateString('tr-TR') : '-',
        // CSV düz metin olduğu için yüksek değerleri yanına (!) koyarak belirtebiliriz
        Buyuk: t.systolic >= 140 ? `${t.systolic} (!)` : t.systolic,
        Kucuk: t.diastolic >= 90 ? `${t.diastolic} (!)` : t.diastolic,
        Nabiz: t.pulse || '-',
        Notlar: t.notes || ''
    }));

    const csv = Papa.unparse(data);
    // Excel'in Türkçe karakterleri tanıması için UTF-8 BOM ekliyoruz (\ufeff)
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "tansiyon-verileri.csv");
};

export const exportToDoc = (tensions: any[]) => {
    if (isDataEmpty(tensions)) return;

    const tableRows = tensions.map(t => {
        // Word dosyasında yüksek değerleri kırmızı ve kalın yapmak için inline CSS
        const sysStyle = t.systolic >= 140 ? 'color: #dc2626; font-weight: bold;' : '';
        const diaStyle = t.diastolic >= 90 ? 'color: #dc2626; font-weight: bold;' : '';

        return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${t.date ? new Date(t.date).toLocaleDateString('tr-TR') : '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align:center; ${sysStyle}">${t.systolic}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align:center; ${diaStyle}">${t.diastolic}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align:center;">${t.pulse || '-'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${t.notes || ''}</td>
        </tr>`;
    }).join("");

    const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head><meta charset='utf-8'><style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #3b82f6; color: white; padding: 10px; border: 1px solid #ddd; }
    </style></head>
    <body>
      <h2>Tansiyon Takip Kayitlari</h2>
      <table>
        <thead><tr><th>Tarih</th><th>Buyuk</th><th>Kucuk</th><th>Nabiz</th><th>Notlar</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
    `;

    const blob = new Blob([content], { type: 'application/msword' });
    saveAs(blob, "tansiyon-raporu.doc");
};