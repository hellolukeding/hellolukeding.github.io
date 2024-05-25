import { Query } from "luke-awesome-query";
import { GITHUB_API } from "src/apis/hosts";

const githubQuery = new Query({
  baseUrl: GITHUB_API,
  timeOut: 15000,
});

export default githubQuery;
