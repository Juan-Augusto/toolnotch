import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AppQrCodeGenerator, {
  buildQrString,
} from '@/components/utilities/AppQrCodeGenerator'
import UtilityToolHeader from '@/app/[locale]/tools/utilities/components/UtilityToolHeader'
import UtilityToolContent from '@/app/[locale]/tools/utilities/components/UtilityToolContent'
import QRCode from 'qrcode'

jest.mock('qrcode', () => ({
  toCanvas: jest.fn().mockImplementation((canvas) => Promise.resolve(canvas)),
  toString: jest.fn().mockResolvedValue('<svg xmlns="http://www.w3.org/2000/svg">mock-qr</svg>'),
}))

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    return (key: string) => {
      const translations: Record<string, string> = {
        metaTitle: 'Gerador de QR Code: Grátis, Sem Cadastro | ToolNotch',
        metaDescription: 'Gere um QR Code grátis para qualquer URL...',
        title: 'Gerador de QR Code',
        description: 'Crie um QR Code para qualquer URL, texto, senha WiFi, e-mail ou telefone.',
        typeUrl: 'URL / Link',
        typeText: 'Texto Simples',
        typeEmail: 'E-mail',
        typePhone: 'Telefone',
        typeWifi: 'WiFi',
        urlLabel: 'Insira a URL',
        urlPlaceholder: 'https://exemplo.com',
        textLabel: 'Insira o texto',
        textPlaceholder: 'Seu texto aqui...',
        emailTo: 'Endereço de E-mail',
        emailSubject: 'Assunto (opcional)',
        emailBody: 'Mensagem (opcional)',
        phonePlaceholder: '+55 11 99999-9999',
        phoneLabel: 'Número de Telefone',
        wifiSsid: 'Nome da Rede (SSID)',
        wifiPassword: 'Senha',
        wifiSecurity: 'Tipo de Segurança',
        wifiWpa: 'WPA / WPA2',
        wifiWep: 'WEP',
        wifiNone: 'Nenhuma (rede aberta)',
        hiddenNetwork: 'Rede oculta',
        contentSettings: 'Dados do Conteúdo',
        reset: 'Limpar',
        showPassword: 'Ver senha',
        hidePassword: 'Ocultar senha',
        preview: 'Pré-visualização do QR Code',
        downloadPng: 'Baixar PNG',
        downloadSvg: 'Baixar SVG',
        copySvg: 'Copiar SVG',
        copied: 'Copiado!',
        size: 'Resolução de Saída',
        size256: '256px (Pequeno)',
        size512: '512px (Médio)',
        size1024: '1024px (Grande)',
        emptyState: 'Preencha os campos ao lado para gerar seu QR Code instantaneamente',
      }
      return translations[key] ?? `${namespace}.${key}`
    }
  },
}))

jest.mock('@/components/AppAffiliateOffers', () => {
  return function MockAffiliateOffers() {
    return <div data-testid="mock-affiliate-offers" />
  }
})

jest.mock('@/components/AppAffiliateStickyBar', () => {
  return function MockAffiliateStickyBar() {
    return <div data-testid="mock-affiliate-sticky" />
  }
})

describe('QR Code Generator Tool Integration', () => {
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
  const originalAnchorClick = HTMLAnchorElement.prototype.click

  beforeAll(() => {
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,mockpngdata')
    HTMLAnchorElement.prototype.click = jest.fn()
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-qr-svg')
    global.URL.revokeObjectURL = jest.fn()
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    })
  })

  afterAll(() => {
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL
    HTMLAnchorElement.prototype.click = originalAnchorClick
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('buildQrString helper unit checks', () => {
    it('builds URL string correctly', () => {
      expect(buildQrString('url', { url: 'https://toolnotch.com' })).toBe('https://toolnotch.com')
    })

    it('builds text string correctly', () => {
      expect(buildQrString('text', { text: 'Hello World' })).toBe('Hello World')
    })

    it('builds email mailto string correctly', () => {
      expect(
        buildQrString('email', {
          to: 'test@example.com',
          subject: 'Feedback',
          body: 'Great tool!',
        })
      ).toBe('mailto:test@example.com?subject=Feedback&body=Great%20tool!')
    })

    it('builds phone tel string correctly', () => {
      expect(buildQrString('phone', { phone: '+123456789' })).toBe('tel:+123456789')
    })

    it('builds wifi string correctly with hidden flag', () => {
      expect(
        buildQrString(
          'wifi',
          { ssid: 'MyHome', password: 'secretpassword', security: 'WPA' },
          true
        )
      ).toBe('WIFI:S:MyHome;T:WPA;P:secretpassword;H:true;;')
    })
  })

  describe('Header and Content components', () => {
    it('renders header with breadcrumbs and description without underline borders', () => {
      render(
        <UtilityToolHeader
          title="Gerador de QR Code"
          description="Crie um QR Code para qualquer URL, texto, senha WiFi, e-mail ou telefone."
          locale="pt"
        />
      )

      expect(screen.getByRole('heading', { level: 1, name: 'Gerador de QR Code' })).toBeInTheDocument()
      expect(screen.getByText('Ferramentas')).toBeInTheDocument()
      expect(screen.getByText('Utilidades')).toBeInTheDocument()
      expect(
        screen.getByText(/Crie um QR Code para qualquer URL/)
      ).toBeInTheDocument()
    })

    it('renders how-to steps, FAQs accordion, and related tools', () => {
      const richContent = {
        whatIs: 'Um gerador de código QR cria códigos de barras bidimensionais.',
        howToUse: ['Selecione o tipo', 'Insira os dados', 'Baixe o arquivo'],
        whyItMatters: 'Importante para ponte física e digital.',
        proTip: 'Sempre teste o QR Code antes de imprimir.',
      }
      const faqs = [
        {
          question: 'Os QR Codes são gratuitos?',
          answer: 'Sim: completamente gratuitos e sem marcas d água.',
        },
      ]

      render(
        <UtilityToolContent
          currentToolSlug="qr-code-generator"
          richContent={richContent}
          faqs={faqs}
          locale="pt"
        />
      )

      expect(screen.getByText('Como Usar')).toBeInTheDocument()
      expect(screen.getByText('Selecione o tipo')).toBeInTheDocument()
      expect(screen.getByText('Insira os dados')).toBeInTheDocument()
      expect(screen.getByText('O Que É Esta Ferramenta?')).toBeInTheDocument()
      expect(screen.getByText('Perguntas Frequentes')).toBeInTheDocument()
      expect(screen.getByText('Os QR Codes são gratuitos?')).toBeInTheDocument()
      expect(screen.getByText('Ferramentas Relacionadas')).toBeInTheDocument()
      expect(screen.getByTestId('mock-affiliate-offers')).toBeInTheDocument()
      expect(screen.getByTestId('mock-affiliate-sticky')).toBeInTheDocument()
    })
  })

  describe('AppQrCodeGenerator Interactive Flow', () => {
    it('displays empty state initially', () => {
      render(<AppQrCodeGenerator locale="pt" />)

      expect(screen.getByText('Pré-visualização do QR Code')).toBeInTheDocument()
      expect(
        screen.getByText('Preencha os campos ao lado para gerar seu QR Code instantaneamente')
      ).toBeInTheDocument()
    })

    it('switches between QR types and renders appropriate inputs', () => {
      render(<AppQrCodeGenerator locale="pt" />)

      // Default is URL
      expect(screen.getByPlaceholderText('https://exemplo.com')).toBeInTheDocument()

      // Switch to Plain Text
      fireEvent.click(screen.getByRole('radio', { name: /Texto Simples/i }))
      expect(screen.getByPlaceholderText('Seu texto aqui...')).toBeInTheDocument()

      // Switch to Email
      fireEvent.click(screen.getByRole('radio', { name: /E-mail/i }))
      expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument()
      expect(screen.getByText('Assunto (opcional)')).toBeInTheDocument()

      // Switch to Phone
      fireEvent.click(screen.getByRole('radio', { name: /Telefone/i }))
      expect(screen.getByPlaceholderText('+55 11 99999-9999')).toBeInTheDocument()

      // Switch to WiFi
      fireEvent.click(screen.getByRole('radio', { name: /WiFi/i }))
      expect(screen.getByPlaceholderText('WiFi Network Name')).toBeInTheDocument()
      expect(screen.getByText('Rede oculta')).toBeInTheDocument()
    })

    it('generates QR code and shows preview image and download buttons', async () => {
      render(<AppQrCodeGenerator locale="pt" />)

      const urlInput = screen.getByPlaceholderText('https://exemplo.com')
      fireEvent.change(urlInput, { target: { value: 'https://toolnotch.com' } })

      await waitFor(() => {
        expect(QRCode.toCanvas).toHaveBeenCalled()
      })

      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /Baixar PNG \(256px\)/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Baixar SVG/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Copiar SVG/i })).toBeInTheDocument()
    })

    it('allows changing size resolution', async () => {
      render(<AppQrCodeGenerator locale="pt" />)

      const urlInput = screen.getByPlaceholderText('https://exemplo.com')
      fireEvent.change(urlInput, { target: { value: 'https://toolnotch.com' } })

      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      // Click 512px
      const size512Radio = screen.getByRole('radio', { name: /512px/i })
      fireEvent.click(size512Radio)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Baixar PNG \(512px\)/i })).toBeInTheDocument()
      })
    })

    it('copies SVG to clipboard on click', async () => {
      render(<AppQrCodeGenerator locale="pt" />)

      const urlInput = screen.getByPlaceholderText('https://exemplo.com')
      fireEvent.change(urlInput, { target: { value: 'https://toolnotch.com' } })

      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      const copyBtn = screen.getByRole('button', { name: /Copiar SVG/i })
      fireEvent.click(copyBtn)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          '<svg xmlns="http://www.w3.org/2000/svg">mock-qr</svg>'
        )
      })

      await waitFor(() => {
        expect(screen.getByText('Copiado!')).toBeInTheDocument()
      })
    })

    it('triggers PNG and SVG download actions', async () => {
      render(<AppQrCodeGenerator locale="pt" />)

      const urlInput = screen.getByPlaceholderText('https://exemplo.com')
      fireEvent.change(urlInput, { target: { value: 'https://toolnotch.com' } })

      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      const appendChildSpy = jest.spyOn(document.body, 'appendChild')
      const removeChildSpy = jest.spyOn(document.body, 'removeChild')

      const downloadPngBtn = screen.getByRole('button', { name: /Baixar PNG/i })
      fireEvent.click(downloadPngBtn)

      await waitFor(() => {
        expect(appendChildSpy).toHaveBeenCalled()
      })

      const downloadSvgBtn = screen.getByRole('button', { name: /Baixar SVG/i })
      fireEvent.click(downloadSvgBtn)

      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled()
      })

      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('resets form when Limpar button is clicked', async () => {
      render(<AppQrCodeGenerator locale="pt" />)

      const urlInput = screen.getByPlaceholderText('https://exemplo.com')
      fireEvent.change(urlInput, { target: { value: 'https://toolnotch.com' } })

      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      const resetBtn = screen.getByRole('button', { name: /Limpar/i })
      fireEvent.click(resetBtn)

      expect(
        screen.getByText('Preencha os campos ao lado para gerar seu QR Code instantaneamente')
      ).toBeInTheDocument()
      expect(screen.queryByAltText('QR Code Preview')).not.toBeInTheDocument()
    })
  })
})
