'use client'

interface PercentInputProps {
  value: number
  onChange: (v: number) => void
  label: string
  id?: string
}

export default function PercentInput({ value, onChange, label, id }: PercentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      onChange(Math.min(30, Math.max(0.01, val)))
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step="0.125"
          min="0.01"
          max="30"
          className="w-full pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={handleChange}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
      </div>
    </div>
  )
}
