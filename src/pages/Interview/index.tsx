import { useGithubIssue } from "src/apis/query/github";

interface InterviewProps {}

const Interview: React.FC<InterviewProps> = (props) => {
  const { data } = useGithubIssue();
  console.log(data);
  return <></>;
};

export default Interview;
