import Link from "next/link";
import GoalCard from "../landing/cards/goal";
import IncomeCard from "../landing/cards/income";
import GridBackground from "@/assets/svg/grid-bg";
import { Dict } from "@/dict";

export default function Banner({
  dict,
}: {
  dict: Dict["banner"] & { card: Dict["general"]["card"] };
}) {
  return (
    <section className="py-24 sm:px-6">
      <div className="max-w-7xl mx-auto sm:rounded-xl bg-primary-dark py-40 sm:py-16 relative overflow-hidden px-6 sm:px-0">
        <div className="flex flex-col items-center gap-6 relative z-20">
          <h2 className="text-white text-3xl lg:text-4xl lg:leading-tight leading-tight font-black max-w-md lg:max-w-xl text-center [text-shadow:_4px_4px_0_rgb(11_60_64)]">
            {dict.title}
          </h2>
          <div className="bg-primary/20 rounded-md p-1 flex items-center">
            <Link
              href="https://app.monfuse.com"
              className="bg-primary py-2.5 text-sm px-5 rounded-md text-white"
            >
              {dict.button}
            </Link>
          </div>
        </div>
        <div className="absolute right-6 -bottom-4 z-10">
          <IncomeCard dict={dict.card.income} />
        </div>
        <div className="sm:hidden lg:block absolute left-6 -top-20 sm:-top-4 z-10">
          <GoalCard dict={dict.card.goal} />
        </div>
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <GridBackground />
        </div>
      </div>
    </section>
  );
}
