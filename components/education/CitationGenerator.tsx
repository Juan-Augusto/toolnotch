'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { formatCitation, type CitationFormat, type SourceType, type Author, type CitationInput } from '@/lib/citationFormatter'

interface Props { locale: string }

const SOURCE_TYPES: SourceType[] = ['website', 'book', 'journal', 'youtube', 'newspaper']

const SOURCE_TYPE_KEYS: Record<SourceType, string> = {
  website: 'sourceWebsite',
  book: 'sourceBook',
  journal: 'sourceJournal',
  youtube: 'sourceYoutube',
  newspaper: 'sourceNewspaper',
}

export default function CitationGenerator({ locale }: Props) {
  const t = useTranslations('citationGenerator')

  const defaultFormat: CitationFormat = locale === 'pt' ? 'abnt' : 'apa'
  const [format, setFormat] = useState<CitationFormat>(defaultFormat)
  const [sourceType, setSourceType] = useState<SourceType>('website')
  const [authors, setAuthors] = useState<Author[]>([{ lastName: '', firstName: '' }])
  const [fields, setFields] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const formats: { id: CitationFormat; label: string }[] = [
    { id: 'apa', label: t('formatApa') },
    { id: 'mla', label: t('formatMla') },
    { id: 'chicago', label: t('formatChicago') },
    ...(locale === 'pt' ? [{ id: 'abnt' as CitationFormat, label: t('formatAbnt') }] : []),
  ]

  const input: CitationInput = {
    sourceType,
    authors: authors.filter(a => a.lastName || a.firstName),
    title: fields.title || '',
    year: fields.year,
    month: fields.month,
    day: fields.day,
    url: fields.url,
    accessDate: fields.accessDate,
    siteName: fields.siteName,
    publisher: fields.publisher,
    city: fields.city,
    edition: fields.edition,
    journalName: fields.journalName,
    volume: fields.volume,
    issue: fields.issue,
    pages: fields.pages,
    doi: fields.doi,
    channelName: fields.channelName,
    newspaper: fields.newspaper,
  }

  const citation = formatCitation(input, format)

  function updateField(key: string, value: string) {
    setFields(f => ({ ...f, [key]: value }))
  }

  function updateAuthor(index: number, key: keyof Author, value: string) {
    setAuthors(prev => prev.map((a, i) => i === index ? { ...a, [key]: value } : a))
  }

  function addAuthor() {
    if (authors.length < 6) setAuthors(prev => [...prev, { lastName: '', firstName: '' }])
  }

  function removeAuthor(index: number) {
    setAuthors(prev => prev.filter((_, i) => i !== index))
  }

  async function handleCopy() {
    if (!citation) return
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
  const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"

  return (
    <div className="space-y-6">
      {/* Format selector */}
      <div className="flex flex-wrap gap-2">
        {formats.map(f => (
          <button key={f.id} onClick={() => setFormat(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${format === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Source type selector */}
      <div className="flex flex-wrap gap-2">
        {SOURCE_TYPES.map(s => (
          <button key={s} onClick={() => setSourceType(s)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sourceType === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {t(SOURCE_TYPE_KEYS[s] as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      {/* Author fields */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">{t('authorLabel')}</label>
        {authors.map((a, i) => (
          <div key={i} className="flex gap-2">
            <input value={a.lastName} onChange={e => updateAuthor(i, 'lastName', e.target.value)}
              placeholder={t('authorLastName')} className={inputClass + ' flex-1'} />
            <input value={a.firstName} onChange={e => updateAuthor(i, 'firstName', e.target.value)}
              placeholder={t('authorFirstName')} className={inputClass + ' flex-1'} />
            {authors.length > 1 && (
              <button onClick={() => removeAuthor(i)} className="text-red-500 hover:text-red-700 text-sm px-2">{t('removeAuthor')}</button>
            )}
          </div>
        ))}
        {authors.length < 6 && (
          <button onClick={addAuthor} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ {t('addAuthor')}</button>
        )}
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>{t('titleField')}</label>
        <input value={fields.title || ''} onChange={e => updateField('title', e.target.value)} className={inputClass} />
      </div>

      {/* Dynamic fields by source type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(sourceType === 'website' || sourceType === 'newspaper' || sourceType === 'journal' || sourceType === 'youtube') && (
          <>
            <div><label className={labelClass}>{t('year')}</label><input value={fields.year || ''} onChange={e => updateField('year', e.target.value)} placeholder="2024" className={inputClass} /></div>
            <div><label className={labelClass}>{t('month')}</label><input value={fields.month || ''} onChange={e => updateField('month', e.target.value)} placeholder="March" className={inputClass} /></div>
            <div><label className={labelClass}>{t('day')}</label><input value={fields.day || ''} onChange={e => updateField('day', e.target.value)} placeholder="15" className={inputClass} /></div>
          </>
        )}
        {sourceType === 'book' && (
          <>
            <div><label className={labelClass}>{t('year')}</label><input value={fields.year || ''} onChange={e => updateField('year', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('publisher')}</label><input value={fields.publisher || ''} onChange={e => updateField('publisher', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('city')}</label><input value={fields.city || ''} onChange={e => updateField('city', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('edition')}</label><input value={fields.edition || ''} onChange={e => updateField('edition', e.target.value)} placeholder="3rd" className={inputClass} /></div>
          </>
        )}
        {sourceType === 'website' && (
          <>
            <div><label className={labelClass}>{t('siteName')}</label><input value={fields.siteName || ''} onChange={e => updateField('siteName', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('url')}</label><input value={fields.url || ''} onChange={e => updateField('url', e.target.value)} placeholder="https://" className={inputClass} /></div>
            <div><label className={labelClass}>{t('accessDate')}</label><input value={fields.accessDate || ''} onChange={e => updateField('accessDate', e.target.value)} placeholder="April 1, 2026" className={inputClass} /></div>
          </>
        )}
        {sourceType === 'journal' && (
          <>
            <div><label className={labelClass}>{t('journalName')}</label><input value={fields.journalName || ''} onChange={e => updateField('journalName', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('volume')}</label><input value={fields.volume || ''} onChange={e => updateField('volume', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('issue')}</label><input value={fields.issue || ''} onChange={e => updateField('issue', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('pages')}</label><input value={fields.pages || ''} onChange={e => updateField('pages', e.target.value)} placeholder="45–67" className={inputClass} /></div>
            <div><label className={labelClass}>{t('doi')}</label><input value={fields.doi || ''} onChange={e => updateField('doi', e.target.value)} placeholder="10.1000/xyz123" className={inputClass} /></div>
          </>
        )}
        {sourceType === 'youtube' && (
          <>
            <div><label className={labelClass}>{t('channelName')}</label><input value={fields.channelName || ''} onChange={e => updateField('channelName', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('url')}</label><input value={fields.url || ''} onChange={e => updateField('url', e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>
          </>
        )}
        {sourceType === 'newspaper' && (
          <>
            <div><label className={labelClass}>{t('newspaper')}</label><input value={fields.newspaper || ''} onChange={e => updateField('newspaper', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('city')}</label><input value={fields.city || ''} onChange={e => updateField('city', e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>{t('pages')}</label><input value={fields.pages || ''} onChange={e => updateField('pages', e.target.value)} className={inputClass} /></div>
          </>
        )}
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">{t('outputHeading')}</label>
          {citation && (
            <button onClick={handleCopy} className={`text-sm px-3 py-1 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        {citation ? (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono whitespace-pre-wrap break-words select-all">
            {citation}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-400 italic">
            {t('emptyState')}
          </div>
        )}
      </div>
    </div>
  )
}
