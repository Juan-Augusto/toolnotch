import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spin the Wheel — Random Decision Maker',
  description: 'Free customizable spin wheel. Add your own options and spin to make random decisions. Great for classrooms, teams, and games.',
}

export default function SpinTheWheelPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Spin the Wheel</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
