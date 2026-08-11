'use client'
import { UnitCategory } from '@/lib/unitTypes'
import { CATEGORY_LABELS } from '@/data/units'

const CATEGORIES: UnitCategory[] = [
  'length', 'weight', 'temperature', 'area', 'volume', 'speed', 'time', 'digital-storage', 'pressure',
]

interface CategoryTabsProps {
  activeCategory: UnitCategory
  onSelect: (cat: UnitCategory) => void
}

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-card text-gray-600 border-gray-300 hover:bg-gray-50'}`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
