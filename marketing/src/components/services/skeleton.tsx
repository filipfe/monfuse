import GridBackground from "@/assets/svg/grid-bg";
import { Dict } from "@/dict";
import Link from "next/link";

type Props = {
  dict: Partial<Dict["landing"]["hero"]>;
  children?: React.ReactNode;
};

export default function Skeleton({ dict, children }: Props) {
  return (
    <section className="bg-primary-dark sm:px-6 flex flex-col items-center gap-8 overflow-hidden relative pb-4">
      <div className="relative max-w-7xl mx-auto z-10 overflow-hidden gap-4 sm:px-12 py-12 sm:py-16 lg:py-24 w-full sm:rounded-lg border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]">
        <div className="px-6 flex flex-col gap-4">
          <h1 className="text-4xl max-w-lg sm:text-5xl sm:max-w-xl lg:text-6xl text-white font-black lg:max-w-3xl [text-shadow:_4px_4px_0_rgb(11_60_64)] sm:[text-shadow:_6px_6px_0_rgb(11_60_64)]">
            {dict.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base my-2 sm:my-4 max-w-xl leading-relaxed sm:leading-relaxed">
            {dict.description}
          </p>
          {dict.cta && (
            <div className="w-full flex items-center sm:gap-4 gap-2 max-w-max">
              <div className="bg-primary/20 rounded-md px-1 h-12 flex items-center justify-center flex-1">
                <Link
                  href="https://app.monfuse.com"
                  className="whitespace-nowrap bg-primary py-2.5 text-sm px-5 rounded-md text-white"
                >
                  {dict.cta.primary}
                </Link>
              </div>
              <div className="border border-white/5 rounded-md p-1 flex-1">
                <Link
                  href="#description"
                  className="whitespace-nowrap rounded-md py-2.5 text-sm px-5 backdrop-blur-md border border-white/10 text-white"
                >
                  {dict.cta.secondary}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 lg:block hidden scale-125 origin-bottom-right">
          {children}
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full flex items-center justify-center ">
        <GridBackground />
      </div>
    </section>
  );
}
