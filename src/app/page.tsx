import MoreReview from "@/components/client/MoreReview";
import WellCome from "@/components/client/WellCome";

export default function Home() {
  return (
    <main className="flex w-screen h-screen items-center justify-center">
      <WellCome />
      <MoreReview />
    </main>
  );
}
