import fs from "fs";
import path from "path";
import process from "process";

export const getStaticMD = async (
  year: string,
  name: string
): Promise<[string, string]> => {
  const filename = decodeURIComponent(name);
  const directory = path.join(process.cwd(), `public/md/${year}/${filename}`);
  const content = fs.readFileSync(directory, "utf-8");
  const stats = fs.statSync(directory);
  return [content, stats.birthtime.toLocaleDateString()];
};

//获取文件创建时间
export const getCreatedTime = async (
  year: string,
  name: string
): Promise<string> => {
  const filename = decodeURIComponent(name);
  const directory = path.join(process.cwd(), `public/md/${year}/${filename}`);
  const stats = fs.statSync(directory);
  return stats.birthtime.toLocaleDateString();
};
