'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`w-full cursor-pointer bg-blue-600 hover:not-disabled:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors text-base ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
