"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface FadeInTextRevealProps {
  text: string;
  className?: string;
  key?: string | number;
  type?: "words" | "chars";
  delay?: number;
}

export function FadeInTextReveal({
  text,
  className,
  key,
  type = "words",
  delay = 0,
}: FadeInTextRevealProps) {
  const reduce = useReducedMotion();
  const id = useId();

  const units = type === "chars" ? Array.from(text) : text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === "chars" ? 0.025 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0.1, y: 4, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: EASE_OUT },
    },
  };

  return (
    <motion.div
      key={key ?? id}
      variants={reduce ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap gap-[0.25em] text-neutral-900 dark:text-white font-medium", className)}
    >
      {units.map((unit, idx) => (
        <motion.span
          key={`${unit}-${idx}`}
          variants={reduce ? undefined : itemVariants}
          className="inline-block"
        >
          {unit === " " ? "\u00A0" : unit}
        </motion.span>
      ))}
    </motion.div>
  );
}

export interface SlideUpTextRevealProps {
  text: string;
  className?: string;
  key?: string | number;
  delay?: number;
}

export function SlideUpTextReveal({
  text,
  className,
  key,
  delay = 0,
}: SlideUpTextRevealProps) {
  const reduce = useReducedMotion();
  const id = useId();

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.55, ease: EASE_OUT },
    },
  };

  return (
    <motion.div
      key={key ?? id}
      variants={reduce ? undefined : containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap gap-[0.28em] overflow-hidden text-neutral-900 dark:text-white font-bold", className)}
    >
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden py-0.5">
          <motion.span
            variants={reduce ? undefined : itemVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
