import Image from "next/image";
import Motion from "./motion";

export default function Description() {
  return (
    <section className="bg-dark py-16 lg:py-64 overflow-hidden sm:px-6">
      <div className="relative z-10 flex flex-col lg:grid grid-cols-2 gap-x-24 gap-y-12 max-w-7xl lg:items-center mx-auto w-full">
        <div className="px-6 sm:px-0 flex flex-col gap-6">
          <p className="text-font/80 text-sm leading-relaxed">
            Our app provides an intuitive progress bar for each goal, showing
            you exactly how close you are to reaching your financial milestones.
            You can easily track payments and contributions over time, making it
            easier to see your efforts pay off. The visual representation keeps
            you motivated and focused on achieving your financial ambitions.
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
              src="/app/goals.png"
              alt="Product screenshot"
              className="overflow-hidden object-cover sm:object-contain h-full object-left !relative"
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
            />
          </Motion>
        </div>
      </div>
    </section>
  );
}
