"use client";
import { useEffect, useState } from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import {Noto_Sans_Mono} from "next/font/google";
import Link from "next/link";

const notoSansMono = Noto_Sans_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Home() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").then(
                (registration) => {
                    console.log("Service Worker registered with scope:", registration.scope);
                },
                (error) => {
                    console.log("Service Worker registration failed:", error);
                }
            );
        }
    }, []);

    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = () => {
        if (installPrompt) {
            (installPrompt as any).prompt();
            (installPrompt as any).userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("Kullanıcı PWA'yı yükledi.");
                    setIsInstalled(true);
                } else {
                    console.log("Kullanıcı PWA'yı reddetti.");
                }
                setInstallPrompt(null);
            });
        }
    };

    return (
        <>
                <div className="container flex flex-col justify-center items-center">
                    <div className="w-11/12 sm:w-full md:w-11/12 lg:w-11/12 flex flex-col rounded-lg border bg-white shadow-lg">
                        <div className="border-b px-4 py-3">
                            <div className={`${notoSansMono.className} text-sm font-medium`}>
                                Pressure Recorder
                            </div>
                        </div>

                        <div className="flex flex-1 items-center gap-2 px-2">
                            <Accordion
                                type="single"
                                collapsible
                                className={`w-full rounded-lg p-2 ${notoSansMono.className} font-medium`}
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>What is Pressure Recorder?</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-justify py-2">
                                            The pressure logger allows you to record your blood pressure. It also allows
                                            you to save the information in a
                                            quick <b><i>.doc</i></b> and/or <b><i>.pdf</i></b> file extension format.
                                            You can also do this from your phone and tablet.
                                        </p>

                                        <p><Link href="/addTension" className="text-[#007bff] ">Click to save your blood pressure data</Link></p>

                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How it Work?</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-justify">
                                            All you need to do is enter your big blood pressure and small blood pressure
                                            information. Optionally, you can also save the date information. You can
                                            also correct and delete it later.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How to Record Blood Pressure Information</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-justify">Blood pressure is the force of blood against the walls of the arteries. Blood pressure is recorded as two numbers, the systolic pressure (the pressure when the heart beats) over the diastolic pressure (the pressure when the heart relaxes between beats).</p>

                                        <p className="text-justify py-2">We record this with the systolic pressure first (on the top) and the diastolic pressure second (below). For example, if the systolic pressure is 120 mmHg (millimetres of mercury) and the diastolic pressure is 80 mmHg, we would describe the blood pressure as ‘120 over 80’, written 120/80.</p>

                                        <p className="text-justfiy">
                                            It is also recommended to record pulse rate information as it is essential medical information for medical examinations
                                        </p>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                    {!isInstalled && installPrompt && (
                        <button
                            onClick={handleInstall}
                            className="m-4 px-4 py-2 w-fit bg-blue-500 text-white rounded-lg"
                        >
                            Download Blood Pressure Recorder App
                        </button>
                    )}
                </div>
        </>
    );
}
