import { Dict } from "@/dict";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Services({
  dict,
}: {
  dict: Dict["landing"]["services"];
}) {
  return (
    <section className="bg-light py-16 sm:py-24 sm:px-6">
      <div className="relative w-full mx-auto max-w-7xl">
        <div className="text-center mx-auto pb-4">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">
            {dict.category}
          </h2>
          <h3 className="mx-auto mt-2 sm:mt-4 max-w-xs text-2xl font-black sm:max-w-none sm:text-3xl lg:text-4xl leading-tight sm:leading-tight lg:leading-tight">
            {dict.title}
          </h3>
        </div>
      </div>
      <div className="mx-auto mt-6 sm:mt-12 grid max-w-md grid-cols-1 gap-6 md:max-w-3xl md:grid-cols-2 xl:grid-rows-[max-content_1fr] md:grid-rows-[max-content_max-content_1fr] xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
        <article className="group relative items-start flex flex-col gap-3 justify-between overflow-hidden bg-white border rounded-md">
          <div className="p-6">
            <h4 className="font-medium mb-2">{dict.operations.title}</h4>
            <p className="text-foreground/80 text-sm leading-relaxed mb-4">
              {dict.operations.description}
            </p>
            <Link
              href="/incomes"
              className="font-bold text-primary-dark text-sm underline decoration-2 decoration-primary flex items-center gap-1 max-w-max group/link"
            >
              {dict.operations.link}
              <ChevronRight
                className="transition-transform group-hover/link:translate-x-1 translate-x-0"
                size={12}
                strokeWidth={4}
              />
            </Link>
          </div>
          <Image
            width={1024}
            height={320}
            className="-mb-3 max-h-80 w-full select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:-translate-y-3 transition-transform duration-300"
            src="/app/expenses.png"
            alt={dict.operations._image.alt}
          />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-white pointer-events-none"></div>
        </article>
        <article className="group relative items-start overflow-hidden flex flex-col gap-3 justify-between bg-white border rounded-md order-3 xl:order-none">
          <div className="p-6">
            <h4 className="font-medium mb-2">{dict.goals.title}</h4>
            <p className="text-foreground/80 text-sm leading-relaxed mb-4">
              {dict.goals.description}
            </p>
            <Link
              href="/goals"
              className="font-bold text-primary-dark text-sm underline decoration-2 decoration-primary flex items-center gap-1 max-w-max group/link"
            >
              {dict.goals.link}
              <ChevronRight
                className="transition-transform group-hover/link:translate-x-1 translate-x-0"
                size={12}
                strokeWidth={4}
              />
            </Link>
          </div>
          <Image
            width={1024}
            height={320}
            className="-mb-3 max-h-80 w-full select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:-translate-y-3 transition-transform duration-300"
            src="/app/goals.png"
            alt={dict.goals._image.alt}
          />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 pointer-events-none"></div>
        </article>
        <article className="group relative flex flex-col items-start overflow-hidden bg-white border rounded-md md:row-span-2">
          <div className="pt-6 px-6">
            <h4 className="font-semibold mb-2">{dict.navigation.title}</h4>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {dict.navigation.description}
            </p>
          </div>
          <div className="flex-1 w-full flex flex-col items-end">
            <Image
              width={320}
              height={1024}
              className="-mb-48 max-h-96 sm:max-h-[720px] rounded-tl-md mt-12 -mr-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-transform duration-300 object-cover object-left-top"
              src="/app/nav.png"
              alt={dict.navigation._image.alt}
            />
          </div>
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
        </article>
        <article className="group relative flex flex-col items-start overflow-hidden bg-white rounded-md order-4 md:col-span-2 xl:order-none border gap-3">
          <div className="p-6">
            <h4 className="font-medium mb-2">{dict.stats.title}</h4>
            <p className="text-foreground/80 text-sm leading-relaxed">
              {dict.stats.description}
            </p>
          </div>
          <Image
            width={1024}
            height={512}
            className="-mb-3 max-h-80 px-6 w-full select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:-translate-y-3 transition-transform duration-300 object-cover object-top"
            src="/app/stats.png"
            alt={dict.stats._image.alt}
          />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
        </article>
      </div>
    </section>
  );
}
