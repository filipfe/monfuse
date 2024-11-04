import { Dict } from "@/dict";
import { Coins, Repeat, Wallet2 } from "lucide-react";
import Motion from "../services/motion";

type Operation = {
  icon: React.ReactNode;
  type: keyof Omit<Dict["landing"]["operations"], "title" | "category">;
};

const operations: Operation[] = [
  {
    icon: <Wallet2 size={24} strokeWidth={2.5} className="text-primary" />,
    type: "incomes",
  },
  {
    icon: <Coins size={24} strokeWidth={2.5} className="text-primary" />,
    type: "expenses",
  },
  {
    icon: <Repeat size={24} strokeWidth={2.5} className="text-primary" />,
    type: "recurring-payments",
  },
];

export default function Operations({
  dict,
}: {
  dict: Dict["landing"]["operations"];
}) {
  return (
    <section className="py-16 lg:py-24 px-6" id="operations">
      <div>
        <div className="relative container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mx-auto">
            <h2 className="text-primary font-mono font-medium tracking-wider uppercase">
              {dict.category}
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs font-black sm:max-w-none text-2xl sm:text-3xl lg:text-4xl">
              {dict.title}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 mt-6 sm:mt-12">
            {operations.map(({ icon, type }, i) => (
              <OperationRef icon={icon} index={i} {...dict[type]} key={type} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const OperationRef = ({
  icon,
  title,
  description,
  index,
}: Pick<Operation, "icon"> &
  Dict["landing"]["operations"]["incomes"] & { index: number }) => (
  <Motion
    initial={{ translateX: -24, opacity: 0 }}
    whileInView={{ translateX: 0, opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    viewport={{ once: true, amount: 1 }}
    className="rounded-lg border text-card-foreground bg-background border-none shadow-none"
  >
    <div className="flex flex-col gap-3">
      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg lg:text-xl font-semibold mt-3">{title}</h3>
      <p className="text-font/60 text-sm leading-relaxed">{description}</p>
    </div>
  </Motion>
);
