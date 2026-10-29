'use client'

import { MotionConfig, motion, type HTMLMotionProps } from "framer-motion"

const EASE = [0.22, 1, 0.36, 1] as const

// Honors the visitor's "reduce motion" setting for every animation below.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number
  y?: number
}

// Fades and slides in once, when scrolled into view.
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

type StaggerProps = HTMLMotionProps<"div"> & {
  // true: play on page load (hero). false: play when scrolled into view.
  immediate?: boolean
}

export function Stagger({ immediate = false, children, ...props }: StaggerProps) {
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "-80px" } }

  return (
    <motion.div variants={container} initial="hidden" {...trigger} {...props}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  )
}

// A card that lifts slightly on hover.
export function HoverLift({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} {...props}>
      {children}
    </motion.div>
  )
}

// Slow drifting glow behind the hero.
export function HeroGlow() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 size-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl"
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}
