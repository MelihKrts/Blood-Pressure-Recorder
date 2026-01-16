import {HeroSection} from "@/app/component/home/HeroSection";
import {InfoCards} from "@/app/component/home/InfoCards";
import {AccordionUI} from "@/app/component/home/Accordion";
import {NotLate} from "@/app/component/home/NotLateBox";


export default function Home() {
    return (
        <>
            <HeroSection/>
            <InfoCards/>
            <AccordionUI/>
            <NotLate/>
        </>
    );
}
