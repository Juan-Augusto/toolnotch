import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CpfGenerator from '@/components/developer/CpfGenerator'
import CnpjGenerator from '@/components/developer/CnpjGenerator'
import UuidGenerator from '@/components/developer/UuidGenerator'
import JsonFormatter from '@/components/developer/JsonFormatter'
import Base64Converter from '@/components/developer/Base64Converter'
import HashGenerator from '@/components/developer/HashGenerator'

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, string | number>) => {
      let text = `${namespace}.${key}`
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }
      return text
    }
  },
}))

describe('Developer Tools Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })
  })

  describe('CpfGenerator', () => {
    test('renders generator and switches to validator tab', () => {
      render(<CpfGenerator />)

      expect(screen.getByText('developer.cpfGenerator.tabs.generate')).toBeInTheDocument()
      expect(screen.getByText('developer.cpfGenerator.tabs.validate')).toBeInTheDocument()

      const generateBtn = screen.getByText('developer.cpfGenerator.button.generate')
      fireEvent.click(generateBtn)

      // Should show generated result title
      expect(screen.getByText(/developer\.cpfGenerator\.results\.title/)).toBeInTheDocument()

      // Switch to validator tab
      fireEvent.click(screen.getByText('developer.cpfGenerator.tabs.validate'))
      expect(screen.getByPlaceholderText(/000\.000\.000-00/)).toBeInTheDocument()
    })
  })

  describe('CnpjGenerator', () => {
    test('renders and generates CNPJs', () => {
      render(<CnpjGenerator />)

      expect(screen.getByText('developer.cnpjGenerator.tabs.generate')).toBeInTheDocument()
      expect(screen.getByText('developer.cnpjGenerator.tabs.validate')).toBeInTheDocument()
      expect(screen.getByText('developer.cnpjGenerator.tabs.lookup')).toBeInTheDocument()

      const generateBtn = screen.getByText('developer.cnpjGenerator.button.generate')
      fireEvent.click(generateBtn)

      expect(screen.getByText(/developer\.cnpjGenerator\.results\.title/)).toBeInTheDocument()
    })
  })

  describe('UuidGenerator', () => {
    test('renders and generates UUIDs with bulk options', () => {
      render(<UuidGenerator />)

      expect(screen.getByText('developer.uuidGenerator.tabs.generate')).toBeInTheDocument()
      expect(screen.getByText('developer.uuidGenerator.tabs.inspect')).toBeInTheDocument()

      const generateBtn = screen.getByText('developer.uuidGenerator.button.generate')
      fireEvent.click(generateBtn)

      expect(screen.getByText(/developer\.uuidGenerator\.results\.title/)).toBeInTheDocument()
    })
  })

  describe('JsonFormatter', () => {
    test('renders editor, loads sample, and validates', () => {
      render(<JsonFormatter />)

      expect(screen.getByText('developer.jsonFormatter.button.loadSample')).toBeInTheDocument()

      const loadSampleBtn = screen.getByText('developer.jsonFormatter.button.loadSample')
      fireEvent.click(loadSampleBtn)

      expect(screen.getByText('developer.jsonFormatter.status.validJson')).toBeInTheDocument()
    })
  })

  describe('Base64Converter', () => {
    test('renders and encodes text in real time', () => {
      render(<Base64Converter />)

      expect(screen.getByText('developer.base64Converter.tabs.encode')).toBeInTheDocument()
      expect(screen.getByText('developer.base64Converter.tabs.decode')).toBeInTheDocument()

      const inputArea = screen.getByPlaceholderText('developer.base64Converter.input.encodePlaceholder')
      fireEvent.change(inputArea, { target: { value: 'Hello World' } })

      expect(screen.getByDisplayValue('SGVsbG8gV29ybGQ=')).toBeInTheDocument()
    })
  })

  describe('HashGenerator', () => {
    test('renders input and computes MD5 / SHA hashes', async () => {
      render(<HashGenerator />)

      const inputArea = screen.getByPlaceholderText('developer.hashGenerator.input.placeholder')
      fireEvent.change(inputArea, { target: { value: 'hello' } })

      await waitFor(() => {
        expect(screen.getByText(/5d41402abc4b2a76b9719d911017c592/)).toBeInTheDocument()
      })
    })
  })
})
