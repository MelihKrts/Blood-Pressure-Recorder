"use client"

export const exportToPDF = async (readings: any[]) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Tansiyon Takip Raporu", 20, 20)
    doc.setFontSize(12)

    let y = 30

    readings.forEach((r, index) => {
        const date = new Date(r.created_at).toLocaleDateString("tr-TR")
        const text = `${index + 1}. Tarih: ${date} | Değer: ${r.systolic}/${r.diastolic} | Nabız: ${r.pulse || "-"}`
        doc.text(text, 20, y)
        y += 10

        if (y > 280) {
            doc.addPage()
            y = 20
        }
    })

    doc.save("tansiyon-raporu.pdf")
}

export const exportToDoc = async (readings: any[]) => {
    const { saveAs } = await import("file-saver")

    let content = "Tansiyon Takip Raporu\n\n"
    readings.forEach((r, index) => {
        const date = new Date(r.created_at).toLocaleDateString("tr-TR")
        content += `${index + 1}. Tarih: ${date} - Tansiyon: ${r.systolic}/${r.diastolic} - Nabız: ${r.pulse || "-"}\n`
    })

    const blob = new Blob([content], { type: "application/msword" })
    saveAs(blob, "tansiyon-raporu.doc")
}
