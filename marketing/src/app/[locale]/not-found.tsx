import BackLink from "@/components/not-found/back-link";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 pt-16 px-6">
      <div className="rounded-full h-12 w-12 bg-primary/10 grid place-content-center mb-2">
        <X size={24} className="text-primary" />
      </div>
      <h1 className="font-medium text-lg sm:text-xl lg:text-2xl">
        Page not found
      </h1>
      <p className="text-font/60 text-sm sm:text-base text-center">
        The page you are looking for doesn't exist
      </p>
      <div className="flex items-center gap-3 mt-4">
        <BackLink dict="Go back" />
        <Link
          href="/"
          className="bg-primary text-sm rounded-md border border-primary text-white px-4 h-10 flex items-center gap-2 transition-transform scale-100 active:scale-[0.97]"
        >
          Home <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
