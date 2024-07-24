import { MDXComponents } from "mdx/types";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";

import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { getStaticMD } from "./api";
import CodeBlock from "./comp";
import "./index.css";
export default async function PostIDPage({
  params,
}: {
  params: { type: string; postID: string };
}) {
  const [content, stat] = await getStaticMD(params.type, params.postID);
  const mdxSource = await renderMD(content);
  return (
    <section className="w-full h-full pt-5 pl-10">
      {/* <MDXRemote source={content} /> */}
      <h1 className="flex items-center justify-start text-2xl pb-5">
        <b className="text-center mr-2">{params.type} ▲ </b>
        {decodeURIComponent(params.postID)}
      </h1>

      <hr />
      <p className="pt-2 text-pretty">
        {`创建时间：${stat},  共计字数：${
          content.length
        },  预计阅读时间：${Math.round(content.length / 400)}分钟`}
      </p>
      <article className="w-11/12 h-full flex pt-5">
        <aside className="h-full w-full overflow-auto pb-28 pr-5">
          {/* <MDXRemote source={content} components={components} /> */}
          <MDXRemote {...mdxSource} source={content} />
        </aside>
      </article>
    </section>
  );
}

type MdxOptions = NonNullable<MDXRemoteProps["options"]>["mdxOptions"];

const mdxOptions: MdxOptions = {
  rehypePlugins: [
    [
      // 代码块高亮
      rehypeHighlight,
    ],
    // 代码块自定义属性
    rehypeMdxCodeProps,
  ],
  format: "md",
};

const renderMD = async (val: string): Promise<MDXRemoteProps> => {
  const mdxSource = await serialize(val, {
    mdxOptions: {
      ...mdxOptions,

      development: process.env.NODE_ENV === "development",
    },
    parseFrontmatter: true,
  });
  return {
    source: mdxSource,
    options: { mdxOptions },
    components,
  };
};

const components: MDXComponents = {
  h1: ({ children }: any) => <h1 id={generateId(children)}>{children}</h1>,
  h2: ({ children }: any) => <h2 id={generateId(children)}>{children}</h2>,
  pre: (props: any) => {
    // 扩展代码块 使用下文的rehypeMdxCodeProps插件实现
    const { children, filename } = props as any;
    return <CodeBlock filename={filename}>{children}</CodeBlock>;
  },
};
function generateId(children: React.ReactNode) {
  return children as string;
}
