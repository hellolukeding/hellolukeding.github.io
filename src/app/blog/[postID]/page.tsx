export default async function PostIDPage({
  params,
}: {
  params: { postID: string };
}) {
  return (
    <section className="flex w-full h-full items-center justify-center">
      <h1>{params.postID}</h1>
    </section>
  );
}
