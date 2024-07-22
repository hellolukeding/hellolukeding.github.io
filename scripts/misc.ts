import fs from "fs";
import path from "path";
import process from "process";

export const readerDirectory = () => {
  const directory = path.join(process.cwd(), "public/md");
  const regex = /^20\d{2}$/;
  const obj: {
    [key: string]: string[];
  } = {};
  try {
    const folds = fs.readdirSync(directory).filter((file) => {
      return regex.test(file);
    });
    folds.forEach((fold) => {
      const files = fs.readdirSync(path.join(directory, fold));
      obj[fold] = files;
    });

    fs.writeFileSync(
      path.join(process.cwd(), "public/json/md.json"),
      JSON.stringify(obj)
    );
  } catch (err) {
    console.error(err);
  }
};

export const recordTime = () => {
  const time = new Date().toLocaleString();
  fs.writeFileSync(
    path.join(process.cwd(), "public/misc/time.js"),
    `console.log("%c 本次构建时间: %c${time}",
     "color: #f1f5ee; font-size: 0.7rem; background-color: #20B2AA; padding: 0.5rem;border-radius: 0.5rem;border-top-right-radius: 0;border-bottom-right-radius: 0;",
     "color: #20B2AA; font-size: 0.7rem; background-color: #f1f5ee; padding: 0.5rem;border-radius: 0.5rem;border-top-left-radius: 0;border-bottom-left-radius: 0;",
     )`
  );
};
