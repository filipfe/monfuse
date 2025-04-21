"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function GoBackLink() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="bg-white"
      onClick={() => router.back()}
    >
      <ChevronLeft size={14} />
      Go Back
    </Button>
  );
}
