import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Random Name Picker — Pick a Random Name from a List',
  description: 'Free random name picker. Paste a list of names, spin, and let the tool choose a winner. Perfect for giveaways and classrooms.',
}

export default function RandomNamePickerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Random Name Picker</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
