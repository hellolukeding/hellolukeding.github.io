"use client";

import { AccordionContent } from "@/components/ui/accordion";

interface ClientAccordionContentProps {
  file: string;
}

const ClientAccordionContent: React.FC<ClientAccordionContentProps> = (
  props
) => {
  return (
    <AccordionContent
      onClick={(e) => {
        e.stopPropagation;
        console.log(props.file);
      }}
      className="cursor-pointer"
    >
      {props.file}
    </AccordionContent>
  );
};

export default ClientAccordionContent;
