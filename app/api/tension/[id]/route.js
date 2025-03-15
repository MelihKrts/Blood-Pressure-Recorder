import {NextResponse} from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Tension from "../../../../models/tension";
import tension from "../../../../models/tension";


export async function PUT(request, {params}) {
    try {
        // MongoDB Bağlantısını sağla
        await connectMongoDB();

        const {id} = params;
        const {
            newBigTension: bigTension,
            newSmallTension: smallTension,
            newSelectedDate: selectedDate,
            newPulse: pulse
        } = await request.json();

        // Eğer ID geçersizse hata döndür
        if (!id) {
            return NextResponse.json({message: "Invalid ID"}, {status: 400});
        }

        // Tarih formatını Date nesnesine çevir
        const formattedDate = new Date(selectedDate);
        if (isNaN(formattedDate.getTime())) {
            return NextResponse.json({message: "Invalid date format"}, {status: 400});
        }

        // Güncelleme işlemi
        const updatedTension = await Tension.findByIdAndUpdate(
            id,
            {bigTension, smallTension, selectedDate: formattedDate, pulse},
            {new: true}
        );

        // ID bulunamazsa
        if (!updatedTension) {
            return NextResponse.json({message: "Tension info not found"}, {status: 404});
        }

        return NextResponse.json({message: "Tension info updated", updatedTension}, {status: 200});
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({message: "Error updating tension info", error: error.message}, {status: 500});
    }
}

export async function GET(request, { params }) {
    try {
        // MongoDB'ye bağlan
        await connectMongoDB();

        // ID'yi kontrol et
        const { id } = params;
        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        // ID ile veri çek
        const tension = await Tension.findOne({ _id: id });

        // Eğer veri bulunamazsa
        if (!tension) {
            return NextResponse.json({ message: "Tension info not found" }, { status: 404 });
        }

        return NextResponse.json({ tension }, { status: 200 });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Error fetching tension info", error: error.message }, { status: 500 });
    }
}