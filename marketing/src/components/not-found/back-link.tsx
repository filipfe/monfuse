"use client";

import { useRouter } from "next/navigation";

export default function BackLink() {
  const router = useRouter();
  return (
    <button
      className="bg-white rounded-md border px-4 h-10 min-w-20 transition-transform scale-100 active:scale-[0.97]"
      onClick={() => router.back()}
    >
      Go Back
    </button>
  );
}
