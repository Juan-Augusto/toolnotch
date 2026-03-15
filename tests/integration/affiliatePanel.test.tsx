/**
 * Integration tests for AffiliatePanel.
 *
 * Verifies that every outbound link rendered by the panel has the correct
 * security attributes (target="_blank" + rel="noopener noreferrer") and that
 * the correct links are shown for each loanType bucket.
 */

import React from 'react'
import { render, screen, within } from '@testing-library/react'
import AffiliatePanel from '@/components/finance/calculator/AffiliatePanel'

// ---------------------------------------------------------------------------
// Helper — collect all <a> elements inside the rendered panel
// ---------------------------------------------------------------------------

function getLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll('a'))
}

// ---------------------------------------------------------------------------
// Security attributes — every link, every loanType
// ---------------------------------------------------------------------------

const ALL_LOAN_TYPES = ['loan', 'mortgage', 'car', 'personal', 'student', 'affordability', 'interest'] as const

describe('AffiliatePanel — link security attributes', () => {
  test.each(ALL_LOAN_TYPES)(
    'all links have target="_blank" for loanType="%s"',
    (loanType) => {
      const { container } = render(<AffiliatePanel loanType={loanType} />)
      const links = getLinks(container)
      expect(links.length).toBeGreaterThan(0)
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    },
  )

  test.each(ALL_LOAN_TYPES)(
    'all links have rel="noopener noreferrer" for loanType="%s"',
    (loanType) => {
      const { container } = render(<AffiliatePanel loanType={loanType} />)
      const links = getLinks(container)
      expect(links.length).toBeGreaterThan(0)
      links.forEach((link) => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    },
  )

  test.each(ALL_LOAN_TYPES)(
    'all href values are absolute HTTPS URLs for loanType="%s"',
    (loanType) => {
      const { container } = render(<AffiliatePanel loanType={loanType} />)
      const links = getLinks(container)
      links.forEach((link) => {
        expect(link.href).toMatch(/^https:\/\//)
      })
    },
  )
})

// ---------------------------------------------------------------------------
// Mortgage / affordability — shows LendingTree + Bankrate links
// ---------------------------------------------------------------------------

describe('AffiliatePanel — mortgage loanType', () => {
  test('renders LendingTree mortgage link', () => {
    render(<AffiliatePanel loanType="mortgage" />)
    const link = screen.getByRole('link', { name: /lendingtree/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.lendingtree.com/home/mortgage/')
  })

  test('renders Bankrate link', () => {
    render(<AffiliatePanel loanType="mortgage" />)
    const link = screen.getByRole('link', { name: /bankrate/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.bankrate.com/mortgages/')
  })

  test('renders exactly 2 links', () => {
    const { container } = render(<AffiliatePanel loanType="mortgage" />)
    expect(getLinks(container)).toHaveLength(2)
  })
})

describe('AffiliatePanel — affordability loanType', () => {
  test('treats affordability the same as mortgage (shows both links)', () => {
    const { container } = render(<AffiliatePanel loanType="affordability" />)
    expect(getLinks(container)).toHaveLength(2)
  })

  test('renders LendingTree mortgage link for affordability', () => {
    render(<AffiliatePanel loanType="affordability" />)
    const link = screen.getByRole('link', { name: /lendingtree/i })
    expect(link).toHaveAttribute('href', 'https://www.lendingtree.com/home/mortgage/')
  })
})

// ---------------------------------------------------------------------------
// Car — shows LendingTree auto link only
// ---------------------------------------------------------------------------

describe('AffiliatePanel — car loanType', () => {
  test('renders LendingTree auto loan link', () => {
    render(<AffiliatePanel loanType="car" />)
    const link = screen.getByRole('link', { name: /auto loan/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://www.lendingtree.com/auto/')
  })

  test('renders exactly 1 link', () => {
    const { container } = render(<AffiliatePanel loanType="car" />)
    expect(getLinks(container)).toHaveLength(1)
  })

  test('does not render Bankrate link', () => {
    render(<AffiliatePanel loanType="car" />)
    expect(screen.queryByRole('link', { name: /bankrate/i })).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------
// Fallback — personal / student / loan / interest → personal LendingTree
// ---------------------------------------------------------------------------

const FALLBACK_TYPES = ['loan', 'personal', 'student', 'interest'] as const

describe('AffiliatePanel — fallback loanTypes', () => {
  test.each(FALLBACK_TYPES)(
    'renders personal loan link at LendingTree for loanType="%s"',
    (loanType) => {
      render(<AffiliatePanel loanType={loanType} />)
      const link = screen.getByRole('link', { name: /personal loan/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://www.lendingtree.com/personal/')
    },
  )

  test.each(FALLBACK_TYPES)(
    'renders exactly 1 link for loanType="%s"',
    (loanType) => {
      const { container } = render(<AffiliatePanel loanType={loanType} />)
      expect(getLinks(container)).toHaveLength(1)
    },
  )
})

// ---------------------------------------------------------------------------
// Static content — panel header text
// ---------------------------------------------------------------------------

describe('AffiliatePanel — static content', () => {
  test('renders "Compare Current Rates" heading', () => {
    render(<AffiliatePanel loanType="mortgage" />)
    expect(screen.getByText('Compare Current Rates')).toBeInTheDocument()
  })

  test('renders disclaimer copy about illustration rates', () => {
    render(<AffiliatePanel loanType="loan" />)
    expect(screen.getByText(/rates shown are for illustration/i)).toBeInTheDocument()
  })
})
