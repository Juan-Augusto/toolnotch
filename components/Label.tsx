'use client'

import type { LabelHTMLAttributes, ReactNode } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export default function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`inline-block text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1.5 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
