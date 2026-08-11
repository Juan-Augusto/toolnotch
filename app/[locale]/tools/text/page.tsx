import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Text Tools — Word Counter, Readability Checker & More | ToolNotch',
  description: 'Free online text tools: word counter, character counter, readability checker, reading time calculator, and keyword density checker. No signup required.',
  alternates: { canonical: '/tools/text' },
}

const TOOLS = [
  { href: '/tools/text/word-counter', label: 'Word Counter', desc: 'Count words, characters, sentences, and check readability in real time.' },
  { href: '/tools/text/character-counter', label: 'Character Counter', desc: 'Count characters with and without spaces. Great for X, SMS, and meta descriptions.' },
  { href: '/tools/text/sentence-counter', label: 'Sentence Counter', desc: 'Count sentences and paragraphs in any text.' },
  { href: '/tools/text/readability-checker', label: 'Readability Checker', desc: 'Get Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog scores.' },
  { href: '/tools/text/reading-time-calculator', label: 'Reading Time Calculator', desc: 'Estimate how long it takes to read or speak your text.' },
  { href: '/tools/text/word-frequency-counter', label: 'Word Frequency Counter', desc: 'Find the most frequently used keywords in your text.' },
]

export default function TextToolsHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Text Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Analyze and improve your writing. All tools work in your browser — your text never leaves your device.
          </p>
        </div>

        <div className="prose prose-gray max-w-none mb-10 space-y-4 text-gray-700">
          <p>
            Writing productivity tools are software utilities that help bloggers, students, content writers, and SEO professionals
            understand the structure and quality of their text at a glance. Whether you are drafting a 2,000-word blog post,
            composing a tweet, writing an academic essay, or optimizing a web page for search engines, having objective data
            about your writing — word count, sentence length, readability score, keyword distribution — allows you to make
            faster, better-informed decisions. Instead of guessing whether your article is too long or your sentences too
            complex, you can measure it instantly and adjust accordingly. These tools remove the guesswork from the editing
            process and help you publish with confidence.
          </p>
          <p>
            Using text analysis tools is one of the most effective ways to improve writing clarity, readability, and search
            engine optimization simultaneously. Readability scores such as the Flesch Reading Ease index and the Gunning Fog
            Index quantify how easy your content is to understand, helping you match your writing level to your target audience.
            For general web content, a Flesch Reading Ease score of 60–70 ensures that most adults can read comfortably without
            effort. For SEO, tracking keyword density prevents accidental over-optimization (keyword stuffing) while ensuring
            that important terms appear often enough for search engines to understand the topic. Character counters help you
            craft meta descriptions that fit within Google&apos;s 155-character display limit, and reading time calculators signal
            to readers — and ranking algorithms — that your content has appropriate depth and substance.
          </p>
          <p>
            ToolNotch offers a complete suite of free writing tools, all of which run entirely in your browser with no data
            ever sent to a server. The <strong>Word Counter</strong> tallies words, characters, sentences, paragraphs, and
            estimated reading time in real time as you type. The <strong>Character Counter</strong> tracks characters with
            and without spaces, making it ideal for X posts, LinkedIn updates, SMS messages, and meta descriptions.
            The <strong>Readability Checker</strong> provides three industry-standard readability scores — Flesch Reading Ease,
            Flesch-Kincaid Grade Level, and Gunning Fog Index — alongside practical advice for improving each. The
            <strong> Reading Time Calculator</strong> estimates both silent reading time (at 238 words per minute) and speaking
            time (at 130 words per minute), useful for bloggers, educators, and presenters alike. The <strong>Keyword Density
            Checker</strong> surfaces your top content keywords and their percentage frequency, helping you fine-tune SEO
            content without over-optimizing. And the <strong>Paraphraser</strong> helps you rephrase sentences for clarity or
            to avoid unintentional repetition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <h2 className="font-bold text-gray-900 group-hover:text-purple-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <section className="bg-card rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Get the Most From Text Tools</h2>
          <ol className="space-y-4 text-gray-700 list-decimal list-inside">
            <li>
              <strong>Write first, analyze second.</strong> Avoid checking word count or readability while you are still
              drafting. Write your full first draft freely, then paste it into the tool for analysis. Editing as you go
              slows you down and interrupts your flow of ideas.
            </li>
            <li>
              <strong>Target your audience&apos;s reading level.</strong> Use the Readability Checker to ensure your content
              matches the background of your readers. A technical blog aimed at software developers can afford a higher
              Flesch-Kincaid grade level than a general-interest article or a product page targeting a broad consumer
              audience. Aim for grade 6–8 for most web content.
            </li>
            <li>
              <strong>Use character count for every platform-constrained piece.</strong> X limits posts to 280
              characters, Google typically shows only 155–160 characters of a meta description, and SMS messages cap
              at 160 characters. Always run your text through the Character Counter before publishing to avoid truncation
              or awkward cut-offs that reduce click-through rates.
            </li>
            <li>
              <strong>Check keyword density for every SEO article.</strong> After writing, paste your content into the
              Keyword Density Checker to see which words dominate your text. Healthy keyword density sits between 1% and 3%.
              If your primary keyword appears in fewer than 1% of words, search engines may not associate your page strongly
              enough with that topic. If it exceeds 4–5%, you risk a keyword stuffing penalty.
            </li>
          </ol>
        </section>
      </div>
    </main>
  )
}
