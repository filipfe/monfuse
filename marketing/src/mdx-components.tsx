import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: ({ children, ...props }) => (
      <p
        className="leading-relaxed text-sm sm:text-base sm:leading-relaxed"
        {...props}
      >
        {children}
      </p>
    ),
    h1: ({ children, ...props }) => (
      <h1
        {...props}
        className="text-2xl font-black sm:text-3xl lg:text-4xl sm:leading-tight lg:leading-tight leading-tight text-foreground mb-3 max-w-3xl"
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className="text-xl sm:text-2xl lg:text-3xl sm:leading-tight lg:leading-tight leading-tight text-foreground font-bold mt-6 mb-2"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className="text-lg sm:text-xl lg:text-2xl lg:leading-tight leading-snug text-foreground font-bold mt-6 mb-2"
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        {...props}
        className="text-lg lg:text-xl lg:leading-tight leading-tight text-foreground font-bold mt-6 mb-2"
      >
        {children}
      </h4>
    ),
    a: ({ children, ...props }) => (
      <a
        href="/incomes"
        className="font-bold text-primary-dark underline decoration-2 decoration-primary inline-block"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-bold" {...props}>
        {children}
      </strong>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal pl-5 sm:pl-6 flex flex-col gap-2 my-2"
        {...props}
      >
        {children}
      </ol>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className="list-disc pl-5 sm:pl-6 flex flex-col gap-2 my-2"
        {...props}
      >
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li className="text-sm sm:text-base py-1" {...props}>
        {children}
      </li>
    ),
    img: (props) => (
      <Image
        priority
        loading="eager"
        width={1280}
        height={800}
        className="rounded-md object-cover my-8 max-w-3xl w-full"
        {...(props as ImageProps)}
      />
    ),
    // li: ({ children, ...props }) => (
    //   <li className="font-medium" {...props}>
    //     {children}
    //   </li>
    // ),
  };
}
