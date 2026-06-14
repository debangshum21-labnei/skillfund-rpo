"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("0");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 55, damping: 13 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(Number(v).toFixed(decimals));
    });
    return unsub;
  }, [spring, decimals]);

  return <motion.span className={className}>{display}</motion.span>;
}
