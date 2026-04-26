'use client'

import { useState } from 'react'
import ToolWrapper from '@/components/ToolWrapper'
import type { FaqItem } from '@/components/FaqSection'

interface RichContent {
  whatIs: string
  howToUse: string[]
  whyItMatters: string
  proTip: string
}

interface Props {
  title: string
  description: string
  faqs: FaqItem[]
  labels: Record<string, string>
  richContent?: RichContent
}

export default function UserStoryWriterClient({ title, description, faqs, labels, richContent }: Props) {
  const [role, setRole] = useState('')
  const [feature, setFeature] = useState('')
  const [benefit, setBenefit] = useState('')
  const [criteria, setCriteria] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    const story = `As a ${role.trim()}, I want to ${feature.trim()}, so that ${benefit.trim()}.`
    const criteriaLines = criteria.trim()
      ? `\n\n**${labels.acceptanceCriteriaLabel}**\n${criteria.trim()}`
      : ''
    setOutput(`**${labels.storyLabel}**\n${story}${criteriaLines}`)
  }

  function clear() {
    setRole('')
    setFeature('')
    setBenefit('')
    setCriteria('')
    setOutput('')
    setCopied(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canGenerate = role.trim() && feature.trim() && benefit.trim()

  return (
    <ToolWrapper title={title} description={description} breadcrumbLabel={title} faqs={faqs} adSlot="user-story-writer" richContent={richContent}>
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.roleLabel}</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder={labels.rolePlaceholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.featureLabel}</label>
          <input
            type="text"
            value={feature}
            onChange={e => setFeature(e.target.value)}
            placeholder={labels.featurePlaceholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.benefitLabel}</label>
          <input
            type="text"
            value={benefit}
            onChange={e => setBenefit(e.target.value)}
            placeholder={labels.benefitPlaceholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{labels.criteriaLabel}</label>
          <textarea
            value={criteria}
            onChange={e => setCriteria(e.target.value)}
            placeholder={labels.criteriaPlaceholder}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={generate}
            disabled={!canGenerate}
            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.generateButton}
          </button>
          <button
            onClick={clear}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {labels.clearButton}
          </button>
        </div>

        {output && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-sm">{labels.outputHeading}</h3>
              <button
                onClick={copy}
                className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? labels.copiedButton : labels.copyButton}
              </button>
            </div>
            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
