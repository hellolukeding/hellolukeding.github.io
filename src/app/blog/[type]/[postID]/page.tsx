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
  const content = await getStaticMD(params.type, params.postID);
  const mdxSource = await renderMD(content);
  return (
    <section className="w-full h-full pt-5 pl-10">
      {/* <MDXRemote source={content} /> */}
      <h1 className="flex items-center justify-start text-2xl">
        <b className="text-center mr-2">{params.type} ▲ </b>
        {decodeURIComponent(params.postID)}
      </h1>

      <article className="w-full h-full flex pt-10">
        <aside className="h-full w-3/4 overflow-auto pb-28">
          <MDXRemote source={content} {...mdxSource} />
        </aside>
        <aside className="h-full w-1/4 "></aside>
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
    rehypeMdxCodeProps as any,
  ],
};

const renderMD = async (val: string) => {
  const mdxSource = await serialize(val, {
    mdxOptions: {
      ...mdxOptions,
      // development: process.env.NODE_ENV === 'development',
    },
  });
  return mdxSource;
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