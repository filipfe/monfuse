import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Article({
  image,
  href,
  title,
  description,
}: ArticleAttributes) {
  return (
    <article className="border rounded-md p-6 flex flex-col gap-3 max-w-md w-full max-lg:mx-auto bg-white">
      <div className="bg-light overflow-hidden rounded-md h-52 border mb-3">
        <Image
          className="object-cover object-center h-full w-full"
          width={396}
          height={206}
          src={image.src}
          alt={image.alt}
        />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm opacity-75 line-clamp-2">{description}</p>
      <Link
        href={`/blog/${href}`}
        className="font-bold text-primary-dark text-sm underline decoration-2 decoration-primary flex items-center gap-1 max-w-max group/link"
      >
        Czytaj dalej
        <ChevronRight
          className="transition-transform group-hover/link:translate-x-1 translate-x-0"
          size={12}
          strokeWidth={4}
        />
      </Link>
    </article>
  );
}
