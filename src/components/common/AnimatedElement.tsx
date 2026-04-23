"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface AnimatedElementProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedElement({ children, delay = 0, ...props }: AnimatedElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
