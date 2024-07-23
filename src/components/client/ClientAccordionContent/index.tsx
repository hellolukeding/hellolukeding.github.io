"use client";

import { AccordionContent } from "@/components/ui/accordion";
import Link from "next/link";

interface ClientAccordionContentProps {
  type: string;
  file: string;
}

const ClientAccordionContent: React.FC<ClientAccordionContentProps> = (
  props
) => {
  return (
    <AccordionContent className={`cursor-pointer hover:text-green-500`}>
      <Link href={`/blog/${props.type}/${encodeURIComponent(props.file)}`}>
        {props.file}
      </Link>
    </AccordionContent>
  );
};

export default ClientAccordionContent;
