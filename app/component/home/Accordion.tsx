import React from "react"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Noto_Sans_Mono} from "next/font/google";
import Link from "next/link";
import {ChevronRight, Info} from "lucide-react";

const notoSansMono = Noto_Sans_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const AccordionUI = () => {
    return (
        <>
            <div className="container flex flex-col justify-center items-center">
                <div
                    className="w-11/12 sm:w-full md:w-11/12 lg:w-11/12 flex flex-col rounded-lg border bg-white shadow-lg">
                    <div className="border-b px-4 py-3">
                        <div className={`${notoSansMono.className} flex flex-row items-center text-sm font-medium`}>
                            <Info className="text-[#4f46e5] size-7 fill-[#4f46e5] stroke-[#fff]"/>
                            <h3 className="px-2 font-bold">Sıkça Sorulan Sorular</h3>
                        </div>
                    </div>

                    <div className="flex flex-1 items-center gap-2 px-2">
                        <Accordion
                            type="single"
                            collapsible
                            className={`w-full rounded-lg p-2 ${notoSansMono.className} font-medium`}
                        >
                            <AccordionItem value="item-1">
                                <AccordionTrigger><b>Pressur Recorder Nedir?</b></AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-justify py-2">
                                        Pressure Recorder, kan basıncı değerlerinizi düzenli olarak kaydetmenizi sağlayan web sayfasıdır.
                                    </p>

                                    <ul className="list-disc list-inside list-disc-marker:text-[#4f46e5] space-y-2 ">
                                        <li>Kan basıncı verilerini hızlıca kaydedin.</li>
                                        <li>Bilgileri <b>.doc</b> ve <b>.pdf</b> formatında kaydedin.</li>
                                        <li>Çoklu cihazlardan erişin.</li>
                                    </ul>

                                    <Link href="/addTension" className="flex gap-2 items-center text-[#007bff] py-2">Verilerinizi kaydetmeye başlayın
                                    <ChevronRight/></Link>

                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger><b>Nasıl Çalışır?</b></AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-justify">
                                        Ücretsiz kayıt olun. Tansiyon bilgilerinizi ve zamanını girin. Daha sonra <i><b>.doc</b></i> veya <i><b>.pdf</b></i> dosya türünde indirebilirsiniz.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger><b>Kan Basıncı Bilgileri Nasıl Kaydedilir?</b></AccordionTrigger>
                                <AccordionContent>

                                    <p className="text-justify pb-4">
                                        Kan basıncı, kanın atardamar duvarlarına uyguladığı kuvvettir. Kan basıncı iki sayı olarak kaydedilir: sistolik basınç (kalbin attığı zamanki basınç) / diyastolik basınç (kalbin atışlar arasında gevşediği zamanki basınç).
                                    </p>

                                    <p className="text-justify pb-4">                         Bunu, önce sistolik basıncı (üstte), sonra diyastolik basıncı (altta) kaydederek yaparız. Örneğin, sistolik basınç 120 mmHg (milimetre cıva) ve diyastolik basınç 80 mmHg ise, kan basıncını '120 bölü 80' olarak, yani 120/80 şeklinde yazarız.</p>

                                    <p className="text-justfiy ">
                                        Nabız hızı bilgisinin de kaydedilmesi önerilir, çünkü bu tıbbi muayeneler için hayati önem taşıyan bir bilgidir.
                                    </p>

                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    )
}