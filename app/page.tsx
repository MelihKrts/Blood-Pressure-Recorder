// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
//
// import Link from "next/link"
// import Header from "@/app/component/Header";
// import { Noto_Sans_Mono } from "next/font/google";
// import Footer from "@/app/component/Footer";
//
// const notoSansMono = Noto_Sans_Mono({
//     subsets: ["latin"],
//     weight: ["400", "700"], // Kullanmak istediğin ağırlıkları belirtebilirsin.
// });
//
//
// export default function Home() {
//   return (
//       <>
//           <Header/>
//           <section className="w-full min-h-screen bg-yellow-200 flex justify-center items-center ">
//               <div className="container mt-11 flex items-center justify-center">
//                   <div className="flex w-1/2 flex-col rounded-lg border">
//                       <div className="border-b px-4 py-3">
//                           <div className={`${notoSansMono.className}text-sm font-medium`}>Pressure Recorder</div>
//                       </div>
//
//                       <div className="flex flex-1 items-center gap-2 px-2">
//                           <Accordion type="single" collapsible
//                                      className={`w-full rounded-lg p-2 ${notoSansMono.className} font-medium`}>
//                               <AccordionItem value="item-1">
//                                   <AccordionTrigger className="font-medium">What is Pressure
//                                       Recorder?</AccordionTrigger>
//                                   <AccordionContent>
//                                       {/*<Link href="/addTension">Content</Link>*/}
//                                       <p className="text-justify px-2">The pressure logger allows you to record your
//                                           blood pressure. It also allows you to save the information in a
//                                           quick <b><i>.doc</i></b> and/or <b><i>.pdf</i></b> file extension format. You
//                                           can also do this from your phone and tablet.</p>
//                                   </AccordionContent>
//                               </AccordionItem>
//                               <AccordionItem value="item-2">
//                                   <AccordionTrigger>How it Work?</AccordionTrigger>
//                                   <AccordionContent>
//                                       <p className="text-justify px-2">
//                                           All you need to do is enter your big blood pressure and small blood pressure
//                                           information. Optionally, you can also save the date information. You can also
//                                           correct and delete it later.
//                                       </p>
//                                   </AccordionContent>
//                               </AccordionItem>
//                               <AccordionItem value="item-3">
//                                   <AccordionTrigger>Is it animated?</AccordionTrigger>
//                                   <AccordionContent>
//                                       Yes. It's animated by default, but you can disable it if you prefer.
//                                   </AccordionContent>
//                               </AccordionItem>
//                           </Accordion>
//                       </div>
//
//                   </div>
//               </div>
//           </section>
//
//           <Footer/>
//       </>
//   );
// }

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import Link from "next/link";
import Header from "@/app/component/Header";
import { Noto_Sans_Mono } from "next/font/google";
import Footer from "@/app/component/Footer";

const notoSansMono = Noto_Sans_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Home() {
    return (
        <>
            <Header />
            <section className="w-full min-h-screen bg-yellow-200 flex flex-col justify-center items-center">
                <div className="container flex justify-center items-center">
                    <div className="w-full max-w-lg flex flex-col rounded-lg border bg-white shadow-lg">
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
                                        <p className="text-justify ">
                                            The pressure logger allows you to record your blood pressure. It also allows you to save the information in a
                                            quick <b><i>.doc</i></b> and/or <b><i>.pdf</i></b> file extension format. You can also do this from your phone and tablet.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>How it Work?</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-justify">
                                            All you need to do is enter your big blood pressure and small blood pressure information. Optionally, you can also save the date information. You can also correct and delete it later.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes. It's animated by default, but you can disable it if you prefer.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
