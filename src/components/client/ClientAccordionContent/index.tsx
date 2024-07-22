"use client";

import { AccordionContent } from "@/components/ui/accordion";
import Link from "next/link";

interface ClientAccordionContentProps {
  file: string;
}

const ClientAccordionContent: React.FC<ClientAccordionContentProps> = (
  props
) => {
  return (
    <AccordionContent className={`cursor-pointer hover:text-green-500`}>
      <Link href={`/blog/${encodeURIComponent(props.file)}`}>{props.file}</Link>
    </AccordionContent>
  );
};

export default ClientAccordionContent;
