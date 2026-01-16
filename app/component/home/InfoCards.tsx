import React from "react";
import {FileText, MonitorSmartphone} from "lucide-react";

export const InfoCards = () => {
    return (
        <>
            <section className="w-full">
                <div className="@container">
                    <div className="flex flex-row @3xs:@max-3xl:flex-col mx-4 justify-center gap-6 px-8 mt-4 mb-16 items-center">

                        <div className="bg-white rounded-md w-1/2  @3xs:@max-3xl:w-full @3xl:@max-7xl:w-1/2 flex flex-col items-center justify-center py-2">
                            <FileText className="text-[#3b82f6] size-10 mt-4 mb-2"/>
                            <h3 className="font-bold mb-2">Tansiyon Özetim</h3>
                            <p className="text-center mb-2">Raporlarınızı kolayca dışa aktarın.</p>
                        </div>

                        <div className="bg-white rounded-md w-1/2 @3xs:@max-3xl:w-full @3xl:@max-7xl:w-1/2 flex flex-col items-center justify-center  py-2">
                            <MonitorSmartphone className="text-[#22c55e] size-10 mt-4 mb-2"/>
                            <h3 className="font-bold mb-2">Çoklu Cihazda Kullanım</h3>
                            <p className="text-center mb-2">İnternete bağlanan her cihazdan kullanım.</p>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}