export interface useGithubIssueLabelsResults {
  config: any;
  data: {
    color: string;
    default: boolean;
    description: string;
    id: number;
    name: string;
    node_id: string;
    url: string;
  }[];
}

export interface useGithubIssueByLabelResult {
  data: {
    labels: useGithubIssueLabelsResults[];
    title: string;
    id: number;
    body: string;
  }[];
}
