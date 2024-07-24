import AsideMd from "@/components/server/AsideMd";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from 'next/image';
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "blog",
  description: "luke's blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={inter.className+" flex items-center justify-start w-screen h-screen overflow-hidden"}>
      <aside className="h-full pt-2 pl-0 pr-0 border-y-primary-light border-r-2 ">
        {/* <h1 className="font-dance text-5xl w-full text-center mb-10">{"lukeding"}</h1> */}
        <div className="w-full flex items-center justify-center">
          <Link href="/blog">
            <Image src={"/assets/imgs/bear.png"} priority alt="" className="scale-x-[-1]" style={{
              width: "auto",
            }} width={"150"} height={"100"}/>
          </Link>
        </div>
        <AsideMd />
      </aside>
      <article className="flex-1 w-full h-full" >
      {children}
      </article>
    </main>
  );
}
