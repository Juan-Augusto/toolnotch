'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SpinWheel from '@/components/fun/SpinWheel'

const DEFAULT_ITEMS = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6']

export default function SpinWheelClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [itemsText, setItemsText] = useState(() => {
    const raw = searchParams.get('items')
    if (raw) {
      try { return decodeURIComponent(raw).split(',').join('\n') }
      catch { return DEFAULT_ITEMS.join('\n') }
    }
    return DEFAULT_ITEMS.join('\n')
  })

  const [lastWinner, setLastWinner] = useState<string | null>(null)

  const items = itemsText.split('\n').map(s => s.trim()).filter(s => s.length > 0)

  useEffect(() => {
    const encoded = encodeURIComponent(items.join(','))
    router.replace(`${pathname}?items=${encoded}`, { scroll: false })
  }, [itemsText]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <SpinWheel items={items} onResult={setLastWinner} />
        {lastWinner && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Last result:</p>
            <p className="text-xl font-bold text-green-600">{lastWinner}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Edit items (one per line, min 2)
        </label>
        <textarea
          rows={10}
          value={itemsText}
          onChange={e => setItemsText(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''} · Share URL includes your list
        </p>
      </div>
    </div>
  )
}
