"use client";

import { Button } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBackLink() {
  const router = useRouter();
  return (
    <Button
      startContent={<ChevronLeft size={14} />}
      disableRipple
      className="bg-white border"
      onPress={() => router.back()}
    >
      Go Back
    </Button>
  );
}
