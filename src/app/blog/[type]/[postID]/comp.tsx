"use client";
import { SVGProps, useRef, useState } from "react";

type Props = {
  filename: string;
  children: React.ReactNode;
};
export default function CodeBlock({ filename, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  function copyHandle() {
    setCopied(true);
    navigator.clipboard.writeText(ref.current!.textContent!);
    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <div className="relative">
      {filename && (
        <div className="absolute left-6 top-2 cursor-pointer rounded p-1 text-xs italic text-[#abb2bf]">
          <span className="mr-2">filename:</span>
          {filename}
        </div>
      )}
      <div className=" absolute right-2 top-2 text-xs italic text-[#abb2bf]">
        {getCodeLanguage(children)}
      </div>
      <div
        className="absolute bottom-2 right-2 cursor-pointer rounded bg-white p-1"
        onClick={copyHandle}
      >
        {!copied ? (
          <MdiClipboard />
        ) : (
          <div className="relative">
            <div className="absolute -left-16">
              <div className="rounded bg-white px-1 text-xs italic text-green-400">
                Copied!
              </div>
            </div>
            <MdiClipboardCheck />
          </div>
        )}
      </div>
      <pre className={`${filename ?? "pt-4"}`}>
        <div ref={ref}>{children}</div>
      </pre>
    </div>
  );
}
function getCodeLanguage(children: any) {
  if (!children.props.className) return "";
  const [_, language] = children.props.className?.split("language-");
  return language as string;
}

export function MdiClipboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1"
      ></path>
    </svg>
  );
}

export function MdiClipboardCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m10 17l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9m-6-6a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m7 0h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
      ></path>
    </svg>
  );
}
