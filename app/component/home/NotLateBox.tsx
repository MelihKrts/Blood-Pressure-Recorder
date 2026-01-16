import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const NotLate = () => {
    return(
        <div className=" w-full bg-gradient-to-r from-[#4F46E5] to-[#818CF8]  p-6 relative overflow-hidden text-white text-center mt-8">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="relative z-1 mt-2 gap-4">
                <h3 className="font-bold text-lg mb-2">Sağlığınızı Ertelemeyin</h3>
                <p>Tansiyon bilgilerinizi kaydedin. Doktorunuzla paylaşın.</p>

                <Button variant="outline" className="my-2"><Link href="/login" className="text-black">Hemen Başla</Link></Button>

            </div>
        </div>
    )
}