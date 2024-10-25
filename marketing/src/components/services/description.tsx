import Image, { ImageProps } from "next/image";
import Motion from "./motion";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

type Props = {
  dict: { markdown: string };
  image: ImageProps;
  rtl?: boolean;
};

export default function Description({ dict: { markdown }, image, rtl }: Props) {
  return (
    <section
      id="description"
      className="bg-dark py-12 lg:py-48 overflow-hidden sm:px-6"
    >
      <div
        className={cn(
          "relative z-10 flex flex-col gap-x-24 gap-y-12 max-w-7xl lg:items-center mx-auto w-full",
          rtl ? "lg:flex-row-reverse" : "lg:flex-row"
        )}
      >
        <div className={cn("px-6 sm:px-0 flex flex-col gap-6 lg:flex-1")}>
          <Markdown
            components={{
              h2: ({ children, ...props }) => (
                <h2
                  className="font-semibold text-xl sm:text-2xl lg:text-3xl leading-tight sm:leading-tight lg:leading-tight"
                  {...props}
                >
                  {children}
                </h2>
              ),
              p: ({ children, ...props }) => (
                <p className="text-font/80 text-sm leading-relaxed" {...props}>
                  {children}
                </p>
              ),
              strong: ({ children, ...props }) => (
                <strong className="text-primary" {...props}>
                  {children}
                </strong>
              ),
            }}
          >
            {markdown}
          </Markdown>
        </div>
        <div className="relative w-full h-full flex items-center lg:flex-1">
          <Motion
            initial={{ translateX: 24, opacity: 0 }}
            whileInView={{ translateX: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            className={cn(
              "relative lg:absolute overflow-hidden lg:w-[68rem] sm:rounded-md border",
              rtl ? "right-0" : "left-0"
            )}
          >
            <Image
              fill
              sizes="(min-width: 1024px) 1088px, 100vw"
              className="overflow-hidden object-cover sm:object-contain h-full object-left !relative"
              {...image}
            />
          </Motion>
        </div>
      </div>
    </section>
  );
}
