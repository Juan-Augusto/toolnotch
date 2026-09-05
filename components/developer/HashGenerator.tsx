'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Hash,
  Copy,
  Check,
  Shield,
  KeyRound,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { generateHashes, HashResults } from '@/lib/developer/hashes'

const SAMPLE_TEXT = 'ToolNotch - Segurança & Ferramentas para Desenvolvedores'

export default function HashGenerator() {
  const t = useTranslations('developer.hashGenerator')

  const [input, setInput] = useState('')
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [uppercase, setUppercase] = useState(false)

  // Compare hash
  const [hashToCompare, setHashToCompare] = useState('')

  // Generated hashes state
  const [hashes, setHashes] = useState<HashResults>({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  })
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' })
      return
    }

    let active = true
    generateHashes(input, secret).then((res) => {
      if (active) setHashes(res)
    })

    return () => {
      active = false
    }
  }, [input, secret])

  const copyHash = async (value: string, key: string) => {
    const text = uppercase ? value.toUpperCase() : value.toLowerCase()
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const copyAllHashes = async () => {
    const list = [
      `MD5: ${uppercase ? hashes.md5.toUpperCase() : hashes.md5}`,
      `SHA-1: ${uppercase ? hashes.sha1.toUpperCase() : hashes.sha1}`,
      `SHA-256: ${uppercase ? hashes.sha256.toUpperCase() : hashes.sha256}`,
      `SHA-384: ${uppercase ? hashes.sha384.toUpperCase() : hashes.sha384}`,
      `SHA-512: ${uppercase ? hashes.sha512.toUpperCase() : hashes.sha512}`,
    ]
    if (hashes.hmacSha256) {
      list.push(`HMAC-SHA256: ${uppercase ? hashes.hmacSha256.toUpperCase() : hashes.hmacSha256}`)
    }
    if (hashes.hmacSha512) {
      list.push(`HMAC-SHA512: ${uppercase ? hashes.hmacSha512.toUpperCase() : hashes.hmacSha512}`)
    }

    await navigator.clipboard.writeText(list.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  // Hash comparison
  const compareMatch = useMemo(() => {
    const target = hashToCompare.trim().toLowerCase()
    if (!target) return null
    const all = [
      { name: 'MD5', val: hashes.md5 },
      { name: 'SHA-1', val: hashes.sha1 },
      { name: 'SHA-256', val: hashes.sha256 },
      { name: 'SHA-384', val: hashes.sha384 },
      { name: 'SHA-512', val: hashes.sha512 },
      { name: 'HMAC-SHA256', val: hashes.hmacSha256 || '' },
      { name: 'HMAC-SHA512', val: hashes.hmacSha512 || '' },
    ]
    const match = all.find((h) => h.val && h.val.toLowerCase() === target)
    return match ? { matched: true, algorithm: match.name } : { matched: false }
  }, [hashToCompare, hashes])

  const hashCards = [
    { key: 'md5', label: 'MD5', value: hashes.md5, bits: '128 bits / 32 caracteres' },
    { key: 'sha1', label: 'SHA-1', value: hashes.sha1, bits: '160 bits / 40 caracteres' },
    { key: 'sha256', label: 'SHA-256', value: hashes.sha256, bits: '256 bits / 64 caracteres' },
    { key: 'sha384', label: 'SHA-384', value: hashes.sha384, bits: '384 bits / 96 caracteres' },
    { key: 'sha512', label: 'SHA-512', value: hashes.sha512, bits: '512 bits / 128 caracteres' },
  ]

  if (secret) {
    if (hashes.hmacSha256) {
      hashCards.push({
        key: 'hmacSha256',
        label: 'HMAC-SHA256',
        value: hashes.hmacSha256,
        bits: '256 bits com chave secreta',
      })
    }
    if (hashes.hmacSha512) {
      hashCards.push({
        key: 'hmacSha512',
        label: 'HMAC-SHA512',
        value: hashes.hmacSha512,
        bits: '512 bits com chave secreta',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-bd-base mb-2.5">
            <label className="font-bold text-sm sm:text-base text-tx-primary">
              {t('input.label')}
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(SAMPLE_TEXT)}
                className="text-xs font-medium text-tx-secondary hover:text-neon flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Exemplo</span>
              </button>
              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('input.placeholder')}
            className="w-full p-3 font-mono text-sm border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon leading-relaxed resize-y"
          />
        </div>

        {/* Secret key & Uppercase Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-tx-secondary flex items-center gap-1">
              <KeyRound size={13} className="text-neon" />
              <span>{t('options.secretKey')} (Opcional para HMAC)</span>
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Chave secreta HMAC..."
                className="w-full pl-3 pr-10 py-2 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg text-xs sm:text-sm font-mono focus:outline-none focus:border-neon"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 top-2.5 text-tx-muted hover:text-tx-primary cursor-pointer"
              >
                {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex items-end pb-1.5">
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-tx-primary font-medium">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-bd-base bg-surface"
              />
              <span>{t('options.uppercase')}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Hashes Output */}
      {input && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bd-base">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-neon" />
              <h3 className="font-bold text-base sm:text-lg text-tx-primary">
                {t('results.title')}
              </h3>
            </div>

            <button
              type="button"
              onClick={copyAllHashes}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedAll ? <Check size={14} className="text-neon" /> : <Copy size={14} />}
              <span>{copiedAll ? 'Todos Copiados!' : 'Copiar Todos'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {hashCards.map((h) => {
              const displayVal = uppercase ? h.value.toUpperCase() : h.value.toLowerCase()
              return (
                <div
                  key={h.key}
                  className="p-3.5 bg-surface border border-bd-base rounded-lg space-y-1.5 hover:border-bd-neon/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-tx-primary">{h.label}</span>
                      <span className="text-xs text-tx-muted hidden sm:inline">({h.bits})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyHash(h.value, h.key)}
                      className="p-1.5 text-tx-secondary hover:text-neon bg-elevated hover:bg-card border border-bd-base rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs"
                      title="Copiar Hash"
                    >
                      {copiedKey === h.key ? (
                        <Check size={14} className="text-neon" />
                      ) : (
                        <Copy size={14} />
                      )}
                      <span className="hidden sm:inline">
                        {copiedKey === h.key ? 'Copiado!' : 'Copiar'}
                      </span>
                    </button>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-tx-primary break-all select-all font-medium bg-card/60 p-2.5 rounded border border-bd-base">
                    {displayVal || 'Calculando...'}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Hash Verifier / Comparator Section */}
      <div className="bg-card border border-bd-base rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-bd-base">
          <Shield className="w-5 h-5 text-blue-500" />
          <h4 className="font-bold text-sm sm:text-base text-tx-primary">
            {t('compare.title')}
          </h4>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={hashToCompare}
            onChange={(e) => setHashToCompare(e.target.value)}
            placeholder="Cole um hash esperado para verificar integridade..."
            className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:border-neon"
          />

          {compareMatch && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border text-sm flex items-center gap-2 font-medium ${
                compareMatch.matched
                  ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-500/15 border-red-500/35 text-red-800 dark:text-red-300'
              }`}
            >
              {compareMatch.matched ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Hash idêntico! Corresponde perfeitamente ao <strong>{compareMatch.algorithm}</strong> do texto inserido.</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className="text-red-500 shrink-0" />
                  <span>O hash informado não corresponde a nenhum dos algoritmos do texto inserido.</span>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
