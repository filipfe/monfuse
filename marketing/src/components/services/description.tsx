import Image, { ImageProps } from "next/image";
import Motion from "./motion";
import Link from "next/link";

type Props = {
  content: string;
  image: ImageProps;
};

export default function Description() {
  return (
    <section
      id="description"
      className="bg-dark py-16 lg:py-48 overflow-hidden sm:px-6"
    >
      <div className="relative z-10 flex flex-col lg:grid grid-cols-2 gap-x-24 gap-y-12 max-w-7xl lg:items-center mx-auto w-full">
        <div className="px-6 sm:px-0 flex flex-col gap-6">
          <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl leading-tight sm:leading-tight lg:leading-tight">
            Conquer Your Financial Goals
          </h2>
          <p className="text-font/80 text-sm leading-relaxed">
            Staying committed to financial goals can be difficult without the
            right tools. Many people struggle to track their progress or lose
            sight of their savings targets amidst day-to-day expenses. Without a
            clear, visual way to see how far they've come, it’s easy to become
            discouraged and fall off track. For help staying on top of your
            overall finances, explore how our{" "}
            <Link href="/expenses">
              <strong className="text-primary">expense tracking</strong>
            </Link>{" "}
            can keep your spending in check.
            {/* Additionally, managing multiple
            goals simultaneously—whether short-term or long-term—can feel
            overwhelming, especially when changes in income or unexpected
            expenses occur. */}
          </p>
          <p className="text-font/80 text-sm leading-relaxed">
            Our{" "}
            <Link href="/ai-assistant">
              <strong className="text-primary">AI Assistant</strong>
            </Link>{" "}
            provides personalized insights, helping you understand your progress
            toward your financial milestones. You can easily track payments and
            contributions over time, making it easier to see your efforts pay
            off. The <u>visual representation</u> keeps you motivated and
            focused on achieving your financial ambitions.
          </p>
          <p className="text-font/80 text-sm leading-relaxed">
            From short-term savings goals to long-term financial ambitions, the
            app allows you to tailor your goals according to your unique needs.
            You can add, edit, or delete goals at any time, keeping your
            financial planning flexible and responsive to life’s changes.
          </p>
        </div>
        <div className="relative w-full h-full flex items-center">
          <Motion
            initial={{ translateX: 24, opacity: 0 }}
            whileInView={{ translateX: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative lg:absolute left-0 overflow-hidden lg:w-[72rem] sm:rounded-md border"
          >
            <Image
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="overflow-hidden object-cover sm:object-contain h-full object-left !relative"
              src="/app/goals.png"
              alt="Product screenshot"
            />
          </Motion>
        </div>
      </div>
    </section>
  );
}
