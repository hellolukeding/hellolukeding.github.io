import { useQuery } from "@tanstack/react-query";
import githubQuery from "src/apis/queryInstance/github";
import {
  useGithubIssueByLabelResult,
  useGithubIssueLabelsResults,
} from "./types";

// 获取issue列表
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

// 获取labels列表
export const useGithubIssueLabels = () => {
  const [query, cancle] = githubQuery.get<useGithubIssueLabelsResults>({
    url: "/repos/hellolukeding/hellolukeding.github.io/labels",
  });
  const queryObj = useQuery({
    queryKey: ["/repos/hellolukeding/hellolukeding.github.io/labels"],
    queryFn: () => Promise.resolve(query),
  });
  return { ...queryObj, cancle };
};

//获取根据label获取issue
export const useGithubIssueByLabel = (...labels: string[]) => {
  const [query, cancle] = githubQuery.get<useGithubIssueByLabelResult>({
    url: "/repos/hellolukeding/hellolukeding.github.io/issues",
    query: {
      labels: labels.join(","),
    },
  });
  const queryObj = useQuery({
    queryKey: [
      "/repos/hellolukeding/hellolukeding.github.io/issues",
      ...labels,
    ],
    queryFn: () => Promise.resolve(query),
  });
  return { ...queryObj, cancle };
};
