import fs from "fs";
import Path from "path";
import process from "process";
const getTipsJson = async () => {
  const path = Path.join(process.cwd(), "public/json/site.json");
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data.toString());
};

export { getTipsJson };
