import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${title} Quiz — ToolNotch`,
    description: `Take the ${title} quiz. Find out your result and share with friends.`,
  }
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
