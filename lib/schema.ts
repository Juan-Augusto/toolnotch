const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

export interface FaqItem {
  question: string
  answer: string
}

export function webAppSchema(name: string, url: string, description: string, category = 'UtilitiesApplication') {
  return {
    '@type': 'WebApplication',
    name,
    url: `${BASE_URL}${url}`,
    description,
    applicationCategory: category,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function howToSchema(name: string, steps: string[]) {
  return {
    '@type': 'HowTo',
    name,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${BASE_URL}${url}`,
    })),
  }
}

export function buildJsonLd(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
