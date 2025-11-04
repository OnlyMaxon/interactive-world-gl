import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  className?: string
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (current) =>
    Math.round(current)
  )

  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest)
    })
    return () => unsubscribe()
  }, [value, spring, display])

  return (
    <motion.span
      className={className}
      key={value}
      initial={{ scale: 1.2, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.span>
  )
}
