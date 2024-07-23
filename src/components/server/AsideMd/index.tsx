import ClientAccordionContent from "@/components/client/ClientAccordionContent";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fs from "fs";
import process from "process";

const getMdMenu = async () => {
  const res = fs.readFileSync(process.cwd() + "/public/json/md.json", "utf-8");
  return JSON.parse(res) as Data;
};

const AsideMd = async () => {
  const data = await getMdMenu();
  return (
    <section
      className="w-[350px] overflow-hidden overflow-y-auto pl-5 pr-5 pb-20"
      style={{
        height: "calc(100vh - 150px)",
      }}
    >
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(data).map((item) => {
          return (
            <AccordionItem value={item} key={item}>
              <AccordionTrigger>{item}</AccordionTrigger>
              {data[item].map((file) => {
                return (
                  <ClientAccordionContent type={item} file={file} key={file} />
                );
              })}
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
};

export default AsideMd;

interface Data {
  [key: string]: string[];
}
