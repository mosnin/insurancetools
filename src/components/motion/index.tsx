"use client";

/**
 * Motion primitives (Team 1: Design System + Motion Primitives).
 *
 * Shared animation building blocks used across tool pages. Every component
 * here respects prefers-reduced-motion via useReducedMotion() and falls
 * back to a static, non-animated render when the user has that preference
 * enabled.
 *
 * Import from "@/components/motion".
 */

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type Transition,
} from "motion/react";
import { ReactNode, useEffect } from "react";

const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];

/* -------------------------------------------------------------------------- */
/* FadeIn                                                                      */
/* -------------------------------------------------------------------------- */

export interface FadeInProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Distance in pixels to slide up from on mount. */
  y?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, y = 12, className }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reveal (scroll triggered)                                                  */
/* -------------------------------------------------------------------------- */

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stagger / StaggerItem                                                      */
/* -------------------------------------------------------------------------- */

export interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each child's animation start. */
  delay?: number;
}

const staggerContainerVariants = (staggerDelay: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export function Stagger({ children, className, delay = 0.1 }: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainerVariants(delay)}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* HoverLift                                                                   */
/* -------------------------------------------------------------------------- */

export interface HoverLiftProps {
  children: ReactNode;
  className?: string;
}

export function HoverLift({ children, className }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(15, 23, 42, 0.16)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* AnimatedNumber                                                             */
/* -------------------------------------------------------------------------- */

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      motionValue.jump(value);
    } else {
      motionValue.set(value);
    }
  }, [value, shouldReduceMotion, motionValue]);

  const display = useTransform(springValue, (latest) => {
    const rounded = latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${rounded}${suffix}`;
  });

  return <motion.span className={className}>{display}</motion.span>;
}

/* -------------------------------------------------------------------------- */
/* PageTransition                                                             */
/* -------------------------------------------------------------------------- */

export interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
