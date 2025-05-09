"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="sm:px-10 py-4 sm:py-8 h-full flex flex-col gap-4 sm:gap-6 items-center justify-center">
      <h1 className="text-center text-xl sm:text-2xl lg:text-3xl font-black">
        Coś poszło nie tak!
      </h1>
      <h2 className="max-w-3xl text-center">{error.message}</h2>
      <Button onClick={() => reset()} className="mt-4">
        Spróbuj ponownie
      </Button>
    </div>
  );
}
