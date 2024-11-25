"use client";

import Logo from "@/assets/svg/logo";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

export default function Wrapper({
  children,
  dict,
}: {
  children: React.ReactNode[];
  dict: string;
}) {
  const pathname = usePathname();
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const onScroll = (_e: Event) => setIsDown(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Fragment>
      <div
        className={cn(
          "sm:px-6 py-4",
          !pathname.includes("/blog") &&
            !pathname.includes("/privacy-policy") &&
            "bg-primary-dark"
        )}
      >
        <div
          className={cn(
            "max-w-7xl mx-auto flex items-center justify-between h-14 sm:rounded-lg px-1 border-y sm:border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)]",
            !pathname.includes("/blog") &&
              !pathname.includes("/privacy-policy") &&
              "text-white [&_nav>a]:text-white [&_a]:text-white"
          )}
        >
          {!isDown && (
            <>
              <Link href="/" className="w-9 sm:w-11 ml-5 sm:ml-3">
                <span className="sr-only">{dict}</span>
                <Logo
                  isDown={
                    pathname.includes("/blog") ||
                    pathname.includes("/privacy-policy")
                  }
                />
              </Link>
              {children}
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isDown && (
          <motion.div
            initial={{ translateY: -56 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: -56 }}
            className="sm:px-6 fixed z-50 top-0 right-0 left-0 transition-transform"
          >
            <div
              className={cn(
                "max-w-7xl text-foreground bg-white shadow-lg shadow-primary-dark/10 [&_nav>a]:text-foreground [&_a]:text-foreground mx-auto flex items-center justify-between h-14 sm:rounded-b-lg border bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] px-1"
              )}
            >
              <Link href="/" className="w-9 sm:w-11 ml-5 sm:ml-3">
                <span className="sr-only">{dict}</span>
                <Logo isDown />
              </Link>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
