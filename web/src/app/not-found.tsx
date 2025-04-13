import GoBackLink from "@/components/404/go-back";
import { Button } from "@heroui/react";
import { ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <div className="rounded-full h-12 w-12 bg-primary/10 grid place-content-center mb-2">
        <X size={24} className="text-primary" />
      </div>
      <h1 className="font-medium text-lg sm:text-xl lg:text-2xl">
        Page not found
      </h1>
      <p className="text-font/60">
        The page you are looking for doesn't exist.
      </p>
      <div className="flex items-center gap-3 mt-4">
        <GoBackLink />
        <Link href="/">
          <Button
            type="submit"
            disableRipple
            color="primary"
            endContent={<ChevronRight size={14} />}
            as="div"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
