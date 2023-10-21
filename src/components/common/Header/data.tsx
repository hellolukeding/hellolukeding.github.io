import { RiBilibiliLine, RiWechatFill, SkillIconsGithubDark, SkillIconsInstagram, SkillIconsTwitter } from "./icons";
interface SocialMedia {
    url: string;
    icon: React.ReactNode;
}
export const socialMedia :SocialMedia[]= [
  {
    icon: <SkillIconsGithubDark/>,
    url:'#1',
  },
  {
    icon:<SkillIconsTwitter/>,
    url:'#2',
  },
  {
    icon:<RiWechatFill/>,
    url:'#3',
  },
  {
    icon:<RiBilibiliLine/>,
    url:'#4',
  },
  {
    icon:<SkillIconsInstagram />,
    url:'#5',
  }
]