//@ts-nocheck
import { useQuery } from "@tanstack/react-query";
import githubQuery from "src/apis/queryInstance/github";

export const useGithubIssue = () => {
  const [query, cancle] = githubQuery.get({
    url: "/repos/hellolukeding/hellolukeding.github.io/issues",
  });
  const queryObj = useQuery({
    queryKey: ["/repos/hellolukeding/hellolukeding.github.io/issues"],
    queryFn: () => Promise.resolve(query),
  });
  return { ...queryObj, cancle };
};
