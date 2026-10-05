

export const EVENTS = [
  "SPRINT",          // 100m, 200m, 400m
  "MIDDLE_DISTANCE", // 800m, 1500m
  "LONG_DISTANCE",   // 5K, 10K
  "HALF_MARATHON",
  "MARATHON",
  "ULTRA",
  "HURDLES",
  "RELAY",
  "JUMPS",           // long, triple, high jump
  "THROWS",          // shot put, discus, javelin
  "SWIMMING",
  "CYCLING",
  "TRIATHLON",
  "DUATHLON",
  "POWERLIFTING",
  "WEIGHTLIFTING",
  "CROSSFIT",
  "OTHER",
] as const;

export type Events = (typeof EVENTS)[number];