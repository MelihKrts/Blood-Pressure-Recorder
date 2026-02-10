"use client"

import {Button} from "@/components/ui/button";

const getGreeting = () => {
    const hour = new Date().getHours()
    switch (true) {
        case(hour>=6 && hour<12) :
            return "Günaydın";
        case (hour>=12 && hour<18):
            return "Tünaydın";
        case (hour>=18 && hour<23):
            return "İyi Akşamlar";
        default:
            return "İyi Geceler"
    }
}

interface Props {
    onLogout: () => void
}



export function DashBoardHeader({onLogout}: Props) {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{getGreeting()}</h1>
                <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("tr-TR")}
                </p>
            </div>

            <Button variant="outline" onClick={onLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors">Çıkış Yap</Button>
        </>
    )

}