export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'abnt'
export type SourceType = 'website' | 'book' | 'journal' | 'youtube' | 'newspaper'

export interface Author { lastName: string; firstName: string }

export interface CitationInput {
  sourceType: SourceType
  authors: Author[]
  title: string
  year?: string
  month?: string
  day?: string
  url?: string
  accessDate?: string
  siteName?: string
  publisher?: string
  city?: string
  edition?: string
  journalName?: string
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  channelName?: string
  newspaper?: string
}

function initials(firstName: string): string {
  return firstName.split(/\s+/).filter(Boolean).map(n => n[0].toUpperCase() + '.').join(' ')
}

function apaAuthor(a: Author): string {
  if (!a.lastName) return ''
  return `${a.lastName}, ${initials(a.firstName)}`
}

function apaAuthors(authors: Author[]): string {
  if (!authors.length) return ''
  if (authors.length === 1) return apaAuthor(authors[0])
  if (authors.length === 2) return `${apaAuthor(authors[0])}, & ${apaAuthor(authors[1])}`
  if (authors.length <= 6) return [...authors.slice(0, -1).map(apaAuthor), `& ${apaAuthor(authors[authors.length - 1])}`].join(', ')
  return [...authors.slice(0, 6).map(apaAuthor), '. . .', apaAuthor(authors[authors.length - 1])].join(', ')
}

function mlaAuthors(authors: Author[]): string {
  if (!authors.length) return ''
  if (authors.length === 1) return `${authors[0].lastName}, ${authors[0].firstName}.`
  if (authors.length === 2) return `${authors[0].lastName}, ${authors[0].firstName}, and ${authors[1].firstName} ${authors[1].lastName}.`
  return `${authors[0].lastName}, ${authors[0].firstName}, et al.`
}

function chicagoAuthors(authors: Author[]): string {
  if (!authors.length) return ''
  if (authors.length === 1) return `${authors[0].lastName}, ${authors[0].firstName}`
  return `${authors[0].lastName}, ${authors[0].firstName}, and ${authors.slice(1).map(a => `${a.firstName} ${a.lastName}`).join(', and ')}`
}

function abntAuthors(authors: Author[]): string {
  if (!authors.length) return ''
  return authors.map(a => `${a.lastName.toUpperCase()}, ${a.firstName}`).join('; ')
}

export function formatCitation(input: CitationInput, format: CitationFormat): string {
  if (!input.title) return ''
  switch (format) {
    case 'apa':     return formatApa(input)
    case 'mla':     return formatMla(input)
    case 'chicago': return formatChicago(input)
    case 'abnt':    return formatAbnt(input)
  }
}

function joinParts(parts: (string | undefined)[], sep = ' '): string {
  return parts.filter(Boolean).join(sep).replace(/\s{2,}/g, ' ').trim()
}

function formatApa(i: CitationInput): string {
  const auth = apaAuthors(i.authors)
  const yr = i.year ? `(${i.year}${i.month ? `, ${i.month}` : ''}${i.day ? ` ${i.day}` : ''})` : '(n.d.)'
  switch (i.sourceType) {
    case 'website':
      return joinParts([auth || i.siteName, yr, `${i.title}.`, i.siteName && auth ? i.siteName + '.' : undefined, i.url])
    case 'book':
      return joinParts([auth, yr, `${i.title}${i.edition ? ` (${i.edition} ed.)` : ''}.`, i.publisher ? i.publisher + '.' : undefined])
    case 'journal': {
      const vi = i.volume ? `${i.volume}${i.issue ? `(${i.issue})` : ''}` : ''
      return joinParts([auth, yr, `${i.title}.`, i.journalName ? `${i.journalName},` : undefined, vi + (i.pages ? `, ${i.pages}` : '') + '.', i.doi ? `https://doi.org/${i.doi}` : undefined])
    }
    case 'youtube':
      return joinParts([i.channelName || auth, yr, `${i.title} [Video]. YouTube.`, i.url])
    case 'newspaper':
      return joinParts([auth, yr, `${i.title}.`, i.newspaper ? `${i.newspaper}${i.pages ? `, ${i.pages}` : ''}.` : undefined])
  }
}

function formatMla(i: CitationInput): string {
  const auth = mlaAuthors(i.authors)
  const date = [i.day, i.month, i.year].filter(Boolean).join(' ')
  switch (i.sourceType) {
    case 'website':
      return joinParts([auth, `"${i.title}."`, i.siteName ? `*${i.siteName}*,` : undefined, date ? date + ',' : undefined, i.url ? i.url + '.' : undefined])
    case 'book':
      return joinParts([auth, `*${i.title}*.`, [i.publisher, i.year].filter(Boolean).join(', ') + '.'])
    case 'journal':
      return joinParts([auth, `"${i.title}."`, i.journalName ? `*${i.journalName}*,` : undefined, [i.volume && `vol. ${i.volume}`, i.issue && `no. ${i.issue}`, i.year, i.pages && `pp. ${i.pages}`].filter(Boolean).join(', ') + '.'])
    case 'youtube':
      return joinParts([`"${i.title}."`, '*YouTube*,', [i.channelName && `uploaded by ${i.channelName}`, date].filter(Boolean).join(', ') + ',', i.url ? i.url + '.' : undefined])
    case 'newspaper':
      return joinParts([auth, `"${i.title}."`, i.newspaper ? `*${i.newspaper}*,` : undefined, date ? date + '.' : undefined])
  }
}

function formatChicago(i: CitationInput): string {
  const auth = chicagoAuthors(i.authors)
  const date = i.month && i.day && i.year ? `${i.month} ${i.day}, ${i.year}` : i.year || ''
  switch (i.sourceType) {
    case 'website':
      return joinParts([auth ? auth + '.' : undefined, `"${i.title}."`, i.siteName ? i.siteName + '.' : undefined, date ? date + '.' : undefined, i.url ? i.url + '.' : undefined])
    case 'book':
      return joinParts([auth ? auth + '.' : undefined, `*${i.title}*.`, [i.city, i.publisher, i.year].filter(Boolean).join(': ') + '.'])
    case 'journal': {
      const vi = [i.volume, i.issue && `no. ${i.issue}`].filter(Boolean).join(', ')
      return joinParts([auth ? auth + '.' : undefined, `"${i.title}."`, i.journalName ? `*${i.journalName}*` : undefined, i.year ? `${vi} (${i.year})${i.pages ? ': ' + i.pages : ''}.` : undefined, i.doi ? `https://doi.org/${i.doi}` : undefined])
    }
    case 'youtube':
      return joinParts([i.channelName ? i.channelName + '.' : undefined, `"${i.title}."`, 'YouTube video.', date ? date + '.' : undefined, i.url ? i.url + '.' : undefined])
    case 'newspaper':
      return joinParts([auth ? auth + '.' : undefined, `"${i.title}."`, i.newspaper ? `*${i.newspaper}*,` : undefined, date ? date + '.' : undefined])
  }
}

function formatAbnt(i: CitationInput): string {
  const auth = abntAuthors(i.authors)
  switch (i.sourceType) {
    case 'website':
      return joinParts([auth ? auth + '.' : undefined, `**${i.title}**.`, i.year ? i.year + '.' : undefined, i.url ? `Disponível em: ${i.url}.` : undefined, i.accessDate ? `Acesso em: ${i.accessDate}.` : undefined])
    case 'book':
      return joinParts([auth ? auth + '.' : undefined, `**${i.title}**.`, i.edition ? `${i.edition}. ed.` : undefined, i.city ? i.city + ':' : undefined, i.publisher ? i.publisher + ',' : undefined, i.year ? i.year + '.' : undefined])
    case 'journal':
      return joinParts([auth ? auth + '.' : undefined, `${i.title}.`, [i.journalName, i.city, i.volume && `v. ${i.volume}`, i.issue && `n. ${i.issue}`, i.pages && `p. ${i.pages}`, i.year].filter(Boolean).join(', ') + '.'])
    case 'youtube':
      return joinParts([i.channelName ? i.channelName.toUpperCase() + '.' : undefined, `**${i.title}**.`, i.year ? i.year + '.' : undefined, i.url ? `Disponível em: ${i.url}.` : undefined, i.accessDate ? `Acesso em: ${i.accessDate}.` : undefined])
    case 'newspaper':
      return joinParts([auth ? auth + '.' : undefined, `${i.title}.`, i.newspaper ? `**${i.newspaper}**,` : undefined, [i.city, i.day && i.month ? `${i.day} ${i.month}.` : undefined, i.year].filter(Boolean).join(' ') + '.'])
  }
}
