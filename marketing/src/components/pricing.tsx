import { Dict } from "@/dict";
import Link from "next/link";
import Price from "./pricing/price";
import { Check } from "lucide-react";

export default function Pricing({
  dict,
}: {
  dict: Dict["landing"]["pricing"];
}) {
  return (
    <section className="py-16 sm:py-24 sm:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mx-auto pb-4 max-sm:px-6">
          <h2 className=" text-primary font-mono font-medium tracking-wider uppercase">
            {dict.category}
          </h2>
          <h3 className="mx-auto mt-2 sm:mt-4 max-w-xs text-2xl font-black sm:max-w-none sm:text-3xl lg:text-4xl">
            {dict.title}
          </h3>
        </div>
        <div className="mx-auto mt-6 sm:mt-12 max-w-7xl flex flex-col lg:grid grid-cols-[1fr_max-content] bg-white gap-6 sm:border-x border-y sm:px-6 py-6 sm:rounded-md">
          <div className="flex flex-col gap-3 px-6 sm:py-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              {dict.block.title}
            </h3>
            <p className="text-font/75 text-sm/relaxed max-w-lg">
              {dict.block.description}
            </p>
            <div className="mt-10 mb-4 h-px relative w-full bg-border flex items-center">
              <h4 className="text-primary font-bold text-sm absolute left-0 bg-white pr-3">
                {dict.block.benefits.title}
              </h4>
            </div>
            <ul className="flex flex-wrap sm:grid grid-cols-2 xl:grid-cols-3 gap-y-3 max-sm:gap-x-6">
              {dict.block.benefits.items.map((benefit) => (
                <li className="text-sm flex items-center gap-2" key={benefit}>
                  <Check size={14} className="text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-light sm:border-x border-y sm:rounded-md px-6 sm:px-10 py-6 flex flex-col">
            <h4 className="text-center text-font/75 text-sm sm:text-base">
              {dict.block.price.title}
            </h4>
            <div className="flex-1 flex flex-col justify-center gap-6 min-h-24">
              <div className="flex justify-center items-end gap-2">
                <strong className="text-3xl/none sm:text-4xl/none">
                  <Price />
                </strong>
                <sub className="text-font/75 mb-3">
                  / {dict.block.price.month}
                </sub>
              </div>
            </div>
            <Link
              href="https://app.monfuse.com"
              className="text-white py-2.5 px-5 text-sm text-center font-medium rounded-md bg-primary whitespace-nowrap"
            >
              {dict.block.price.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
