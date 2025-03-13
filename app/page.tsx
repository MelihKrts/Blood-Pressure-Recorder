import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import Link from "next/link"

export default function Home() {
  return (
      <>
          <div className="container flex items-center justify-center">
              <Accordion type="single" collapsible className="w-1/2 border rounded-lg p-4 my-2">
                  <AccordionItem value="item-1">
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                          <Link href="/addTension">Content</Link>
                      </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                      <AccordionTrigger>Is it styled?</AccordionTrigger>
                      <AccordionContent>
                          Yes. It comes with default styles that matches the other
                          components&apos; aesthetic.
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
      </>
  );
}
