import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dice Roller — Roll D&D Dice Online Free',
  description: 'Free online dice roller. Roll d4, d6, d8, d10, d12, d20 and custom dice notation like 3d6+5. Perfect for tabletop RPGs.',
}

export default function DiceRollerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dice Roller</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
