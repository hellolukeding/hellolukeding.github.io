import Image from "next/image";
export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex w-full h-full items-center justify-center">
      <Image src="/assets/imgs/star.png" alt="" width={300} height={100} />
      {children}
    </section>
  );
}
