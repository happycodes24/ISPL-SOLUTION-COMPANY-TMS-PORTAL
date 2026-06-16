import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -4 } : undefined}
      className={clsx(
        "glass rounded-2xl p-5 shadow-glass dark:shadow-glass-dark",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
