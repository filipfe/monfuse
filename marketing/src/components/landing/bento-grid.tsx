import { Dict } from "@/dict";
import { Sparkles } from "../ui/sparkles";
import TextBeam from "../ui/text-beam";
import ExpensesCard from "./cards/expenses";
import GoalCard from "./cards/goal";
import IncomeCard from "./cards/income";
import StockCard from "./cards/stock";

export default function BentoGrid({
  dict,
}: {
  dict: Dict["landing"]["bento-grid"] & { card: Dict["general"]["card"] };
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-primary-dark sm:px-6 flex flex-col gap-8 overflow-hidden relative">
      <div className="max-w-7xl w-full mx-auto mb-2 px-6 sm:px-0">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white font-black tracking-tight [text-shadow:_4px_4px_0_rgb(11_60_64)] sm:[text-shadow:_6px_6px_0_rgb(11_60_64)]">
          {dict.title[0]} <TextBeam>{dict.title[1]}</TextBeam>
        </h2>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:grid grid-cols-3 w-full">
        <div className="relative z-10 flex flex-col gap-4 px-6 sm:px-8 pt-8 lg:pt-12 pb-48 lg:pb-56 overflow-hidden sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
          <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold">
            {dict.plan.title[0]}
            <br /> {dict.plan.title[1]}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            {dict.plan.description}
          </p>
          <div className="absolute -bottom-2 left-8 right-8">
            <GoalCard dict={dict.card.goal} />
          </div>
        </div>
        <div className="relative flex flex-col justify-center gap-4 px-6 sm:px-8 py-12 overflow-hidden sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] col-span-2">
          <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold max-w-[65%]">
            {dict.possibilities.title[0]}
            <br /> {dict.possibilities.title[1]}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed lg:max-w-sm max-w-[60%]">
            {dict.possibilities.description}
          </p>
          <div className="min-h-max flex flex-col gap-4 absolute -right-32 lg:right-8">
            <StockCard />
            <GoalCard dict={dict.card.goal} />
            <IncomeCard dict={dict.card.income} />
            <ExpensesCard dict={dict.card.expense} />
          </div>
        </div>
        <div className="relative overflow-hidden flex flex-col gap-4 px-6 sm:px-8 p-8 sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] col-span-2">
          <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold max-w-[55%]">
            {dict.manage.title[0]}
            <br /> <TextBeam>{dict.manage.title[1]}</TextBeam>
          </h3>
          <div className="absolute -bottom-2 -right-16 sm:right-8">
            <IncomeCard dict={dict.card.income} />
          </div>
        </div>
        <div className="relative min-h-24 z-10 flex flex-col justify-center gap-4 overflow-hidden items-center sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
          <div className="bg-primary/20 rounded-md p-1 w-max relative z-10">
            <button className="bg-primary py-2.5 text-sm px-5 rounded-md text-white">
              {dict.button}
            </button>
          </div>
          <div className="absolute inset-0 w-full h-full">
            <Sparkles
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
