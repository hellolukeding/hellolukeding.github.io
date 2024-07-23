import fs from "fs";
import path from "path";
import process from "process";

export const getStaticMD = async (
  year: string,
  name: string
): Promise<string> => {
  const filename = decodeURIComponent(name);
  const directory = path.join(process.cwd(), `public/md/${year}/${filename}`);
  const content = fs.readFileSync(directory, "utf-8");
  return content;
};
