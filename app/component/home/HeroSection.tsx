import React from "react";
import {Activity} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
    return(
        <section className="w-full mt-11 ">
            <div className="@container">
                <div className="flex flex-col mx-0 @3xs:@max-3xl:mx-4 items-center  justify-center my-2">
                    <div className="rounded-md flex items-center justify-center size-16 bg-[#e0e7ff]">
                        <Activity className="text-[#4f46e5]" size={40} />
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl mt-4 @3xs:@max-3xl:text-lg font-bold">Sağlığınızı Kontrol Altına Alın</h1>
                        <p className="mt-4 text-center text-[#4b5563]">Tansiyon bilgilerinizi kaydedin. Doktorunuzla paylaşın.</p>
                        <p className="text-center  font-bold italic mt-4 mb-4 text-red-400">Sayfa içeriği sadece bilgilendirme amaçlıdır. Tanı ve tedavi için doktora müracat ediniz. Tıbbi bilgi içermemektedir.</p>
                    </div>

                    <div className="flex flex-row gap-4 items-center">

                        <Button variant="outline" className="bg-[#0d6efd] w-24 text-white hover:bg-[#0b5ed7] hover:text-white"><Link href="/register">Üye Ol</Link></Button>

                        <Button variant="outline" className="bg-[#198754] text-white hover:bg-[#157347] w-24 hover:text-white"><Link href="/login">Giriş Yap</Link></Button>
                    </div>

                </div>
            </div>
        </section>
    )
}