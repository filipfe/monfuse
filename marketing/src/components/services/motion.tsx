"use client";

import { HTMLMotionProps, motion } from "framer-motion";

interface Props extends HTMLMotionProps<"div"> {}

export default function Motion({ className, children, ...props }: Props) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}
