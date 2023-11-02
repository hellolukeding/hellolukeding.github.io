
export const classNames = (...args: string[]) => {
  return args.filter(item => item !== "").join(' ');
};