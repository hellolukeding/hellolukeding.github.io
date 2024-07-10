//生成验证以str开头字符串的正则表达式
export const crtPrefixRegex = (str: string) => {
  const regStr = `^${str}`;
  return new RegExp(regStr);
};

//生成验证以str结尾字符串的正则表达式
export const crtSuffixRegex = (str: string) => {
  const regStr = `${str}$`;
  return new RegExp(regStr);
};