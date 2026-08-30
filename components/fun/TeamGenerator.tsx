'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Trash2, Users, Shuffle, Copy, Check, Sparkles, ChevronDown, ChevronUp, AlertCircle, Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  splitIntoTeams,
  splitTeamsBySize,
  splitIntoCustomNamedTeams,
  validateTeamCount,
  validateTeamSize,
  validateCustomTeamNames,
  CustomNamedTeam,
} from '@/lib/teamGenerator'

const SAMPLE_NAMES = [
  'Alice',
  'Bob',
  'Carol',
  'Dave',
  'Eve',
  'Frank',
  'Grace',
  'Heidi',
  'Ivan',
  'Judy',
]

const SAMPLE_TEAM_NAMES = [
  'Time Backend',
  'Time Frontend',
  'Time Infra',
  'Time QA',
]

const TEAM_ACCENTS = [
  { border: 'border-t-4 border-t-neon', numberBg: 'bg-neon/15 text-neon border-bd-neon/40' },
  { border: 'border-t-4 border-t-blue-500', numberBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  { border: 'border-t-4 border-t-purple-500', numberBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  { border: 'border-t-4 border-t-amber-500', numberBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  { border: 'border-t-4 border-t-rose-500', numberBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' },
  { border: 'border-t-4 border-t-teal-500', numberBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30' },
  { border: 'border-t-4 border-t-indigo-500', numberBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' },
  { border: 'border-t-4 border-t-orange-500', numberBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30' },
  { border: 'border-t-4 border-t-cyan-500', numberBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
  { border: 'border-t-4 border-t-fuchsia-500', numberBg: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } },
}

const nameVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0 },
}

export default function TeamGenerator() {
  const t = useTranslations('fun.teamGenerator')

  const [participants, setParticipants] = useState<string[]>([])
  const [nameInput, setNameInput] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  const [mode, setMode] = useState<'byTeams' | 'byTeamSize' | 'byTeamNames'>('byTeams')
  const [teamCount, setTeamCount] = useState(2)
  const [teamSize, setTeamSize] = useState(3)

  const [customTeamNames, setCustomTeamNames] = useState<string[]>([])
  const [teamNameInput, setTeamNameInput] = useState('')
  const [teamNameBulkText, setTeamNameBulkText] = useState('')
  const [showTeamNameBulk, setShowTeamNameBulk] = useState(false)

  const [teams, setTeams] = useState<CustomNamedTeam[]>([])
  const [copied, setCopied] = useState(false)
  const [key, setKey] = useState(0)

  // Validation
  const teamCountValidation = useMemo(() => {
    return validateTeamCount(participants.length, teamCount)
  }, [participants.length, teamCount])

  const teamCountError = useMemo(() => {
    if (teamCountValidation.valid) return null
    return t(`errors.${teamCountValidation.errorKey}`, teamCountValidation.errorParams ?? {})
  }, [teamCountValidation, t])

  const teamSizeValidation = useMemo(() => {
    return validateTeamSize(participants.length, teamSize)
  }, [participants.length, teamSize])

  const teamSizeError = useMemo(() => {
    if (teamSizeValidation.valid) return null
    return t(`errors.${teamSizeValidation.errorKey}`, teamSizeValidation.errorParams ?? {})
  }, [teamSizeValidation, t])

  const customTeamNamesValidation = useMemo(() => {
    return validateCustomTeamNames(participants.length, customTeamNames.length)
  }, [participants.length, customTeamNames.length])

  const customTeamNamesError = useMemo(() => {
    if (customTeamNamesValidation.valid) return null
    return t(`errors.${customTeamNamesValidation.errorKey}`, customTeamNamesValidation.errorParams ?? {})
  }, [customTeamNamesValidation, t])

  const isValid =
    mode === 'byTeams'
      ? teamCountValidation.valid
      : mode === 'byTeamSize'
      ? teamSizeValidation.valid
      : customTeamNamesValidation.valid

  // Handlers - Participants
  const addParticipant = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setParticipants((prev) => [...prev, trimmed])
    setNameInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addParticipant()
    }
  }

  const addBulkParticipants = () => {
    const names = bulkText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    if (names.length === 0) return
    setParticipants((prev) => [...prev, ...names])
    setBulkText('')
    setShowBulk(false)
  }

  const removeParticipant = (index: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setParticipants([])
    setTeams([])
  }

  const loadSample = () => {
    setParticipants(SAMPLE_NAMES)
  }

  // Handlers - Custom Team Names
  const addTeamName = () => {
    const trimmed = teamNameInput.trim()
    if (!trimmed) return
    setCustomTeamNames((prev) => [...prev, trimmed])
    setTeamNameInput('')
  }

  const handleTeamNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTeamName()
    }
  }

  const addBulkTeamNames = () => {
    const names = teamNameBulkText
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    if (names.length === 0) return
    setCustomTeamNames((prev) => [...prev, ...names])
    setTeamNameBulkText('')
    setShowTeamNameBulk(false)
  }

  const removeTeamName = (index: number) => {
    setCustomTeamNames((prev) => prev.filter((_, i) => i !== index))
  }

  const clearTeamNames = () => {
    setCustomTeamNames([])
  }

  const loadSampleTeamNames = () => {
    setCustomTeamNames(SAMPLE_TEAM_NAMES)
  }

  const generate = () => {
    if (!isValid) return
    if (mode === 'byTeams') {
      const result = splitIntoTeams(participants, teamCount)
      setTeams(
        result.map((members, i) => ({
          name: t('results.teamTitle', { number: i + 1 }),
          members,
        }))
      )
    } else if (mode === 'byTeamSize') {
      const res = splitTeamsBySize(participants, teamSize)
      setTeams(
        res.teams.map((members, i) => ({
          name: t('results.teamTitle', { number: i + 1 }),
          members,
        }))
      )
    } else {
      const res = splitIntoCustomNamedTeams(participants, customTeamNames)
      setTeams(res)
    }
    setKey((k) => k + 1)
  }

  const copy = async () => {
    const text = teams
      .map((team) => `${team.name}: ${team.members.join(', ')}`)
      .join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasAnySmallerTeam = useMemo(() => {
    if (teams.length <= 1) return false
    const maxSize = Math.max(...teams.map((t) => t.members.length))
    const minSize = Math.min(...teams.map((t) => t.members.length))
    return maxSize > minSize
  }, [teams])

  return (
    <div className="space-y-6">
      {/* 1. PARTICIPANTS MANAGEMENT SECTION */}
      <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-bd-base">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-neon" />
            <h3 className="text-base sm:text-lg font-bold text-tx-primary">
              {t('participants.title')}
            </h3>
            <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-neon/10 text-neon border border-bd-neon/40">
              {t('participants.count', { count: participants.length })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={loadSample}
              className="px-3 py-1.5 text-tx-secondary hover:text-neon hover:bg-elevated rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <Sparkles size={15} />
              {t('participants.loadSample')}
            </button>
            {participants.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Trash2 size={15} />
                {t('participants.clearAll')}
              </button>
            )}
          </div>
        </div>

        {/* Input row */}
        <div className="flex gap-2.5">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('participants.inputPlaceholder')}
            className="flex-1 px-4 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={addParticipant}
            disabled={!nameInput.trim()}
            className="px-5 py-2.5 bg-neon hover:not-disabled:bg-emerald-500 text-white dark:text-black text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>{t('participants.addButton')}</span>
          </button>
        </div>

        {/* Bulk Toggle Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowBulk(!showBulk)}
            className="text-sm font-medium text-neon hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            {showBulk ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {t('participants.bulkToggle')}
          </button>

          {showBulk && (
            <div className="mt-3 p-4 bg-elevated border border-bd-base rounded-lg space-y-3">
              <textarea
                rows={4}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={t('participants.bulkPlaceholder')}
                className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-md text-sm sm:text-base focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addBulkParticipants}
                  disabled={!bulkText.trim()}
                  className="px-4 py-2 bg-neon hover:not-disabled:bg-emerald-500 text-white dark:text-black rounded-md text-sm font-semibold disabled:opacity-40 cursor-pointer"
                >
                  {t('participants.bulkAddButton')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Participant Chips List */}
        <div className="min-h-[80px] p-3.5 bg-elevated border border-bd-base rounded-lg">
          {participants.length === 0 ? (
            <p className="text-sm text-tx-muted text-center py-5">
              {t('participants.empty')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <AnimatePresence>
                {participants.map((name, index) => (
                  <motion.span
                    key={`${name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-bd-base text-tx-primary text-sm sm:text-base rounded-md shadow-xs"
                  >
                    <span className="font-medium">{name}</span>
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="text-tx-muted hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                      aria-label={`Remover ${name}`}
                    >
                      <X size={15} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 2. TEAM CONFIGURATION (MODE SWITCH & INPUTS) */}
      <div className="bg-card border border-bd-base rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* Mode switcher tabs */}
        <div className="flex flex-col sm:flex-row w-full p-1 bg-elevated border border-bd-base rounded-lg gap-1">
          <button
            type="button"
            onClick={() => setMode('byTeams')}
            className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
              mode === 'byTeams'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-tx-secondary hover:text-tx-primary'
            }`}
          >
            {t('mode.byTeams')}
          </button>
          <button
            type="button"
            onClick={() => setMode('byTeamSize')}
            className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
              mode === 'byTeamSize'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-tx-secondary hover:text-tx-primary'
            }`}
          >
            {t('mode.byTeamSize')}
          </button>
          <button
            type="button"
            onClick={() => setMode('byTeamNames')}
            className={`flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-md transition-all text-center cursor-pointer ${
              mode === 'byTeamNames'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-tx-secondary hover:text-tx-primary'
            }`}
          >
            {t('mode.byTeamNames')}
          </button>
        </div>

        {/* Mode 1: Fixed Team Count */}
        {mode === 'byTeams' && (
          <div className="space-y-1.5 w-full">
            <label className="block text-sm sm:text-base font-medium text-tx-secondary">
              {t('teamCount.label')}
            </label>
            <input
              type="number"
              min={2}
              max={participants.length || 2}
              value={teamCount}
              onChange={(e) => setTeamCount(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm sm:text-base bg-surface text-tx-primary focus:outline-none focus:ring-1 ${
                teamCountError && participants.length >= 2
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-bd-base focus:border-neon focus:ring-neon'
              }`}
              aria-invalid={Boolean(teamCountError && participants.length >= 2)}
            />
            {teamCountError && participants.length >= 2 ? (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                {teamCountError}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-tx-muted mt-1">
                {t('teamCount.hint')}
              </p>
            )}
          </div>
        )}

        {/* Mode 2: Team Size */}
        {mode === 'byTeamSize' && (
          <div className="space-y-1.5 w-full">
            <label className="block text-sm sm:text-base font-medium text-tx-secondary">
              {t('teamSize.label')}
            </label>
            <input
              type="number"
              min={1}
              max={Math.max(1, participants.length - 1)}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm sm:text-base bg-surface text-tx-primary focus:outline-none focus:ring-1 ${
                teamSizeError && participants.length >= 2
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-bd-base focus:border-neon focus:ring-neon'
              }`}
              aria-invalid={Boolean(teamSizeError && participants.length >= 2)}
            />
            {teamSizeError && participants.length >= 2 ? (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                {teamSizeError}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-tx-muted mt-1">
                {t('teamSize.hint')}
              </p>
            )}
          </div>
        )}

        {/* Mode 3: Custom Team Names */}
        {mode === 'byTeamNames' && (
          <div className="space-y-4 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-bd-base">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-neon" />
                <h4 className="text-sm sm:text-base font-bold text-tx-primary">
                  {t('teamNames.title')}
                </h4>
                <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-neon/10 text-neon border border-bd-neon/40">
                  {t('teamNames.count', { count: customTeamNames.length })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={loadSampleTeamNames}
                  className="px-3 py-1.5 text-tx-secondary hover:text-neon hover:bg-elevated rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Sparkles size={15} />
                  {t('teamNames.loadSample')}
                </button>
                {customTeamNames.length > 0 && (
                  <button
                    type="button"
                    onClick={clearTeamNames}
                    className="px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                  >
                    <Trash2 size={15} />
                    {t('teamNames.clearAll')}
                  </button>
                )}
              </div>
            </div>

            {/* Team Name Input row */}
            <div className="flex gap-2.5">
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                onKeyDown={handleTeamNameKeyDown}
                placeholder={t('teamNames.inputPlaceholder')}
                className="flex-1 px-4 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-lg focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={addTeamName}
                disabled={!teamNameInput.trim()}
                className="px-5 py-2.5 bg-neon hover:not-disabled:bg-emerald-500 text-white dark:text-black text-sm sm:text-base font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Plus size={18} />
                <span>{t('teamNames.addButton')}</span>
              </button>
            </div>

            {/* Bulk Team Names Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowTeamNameBulk(!showTeamNameBulk)}
                className="text-sm font-medium text-neon hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                {showTeamNameBulk ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {t('teamNames.bulkToggle')}
              </button>

              {showTeamNameBulk && (
                <div className="mt-3 p-4 bg-elevated border border-bd-base rounded-lg space-y-3">
                  <textarea
                    rows={4}
                    value={teamNameBulkText}
                    onChange={(e) => setTeamNameBulkText(e.target.value)}
                    placeholder={t('teamNames.bulkPlaceholder')}
                    className="w-full px-3.5 py-2.5 border border-bd-base bg-surface text-tx-primary placeholder:text-tx-muted rounded-md text-sm sm:text-base focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addBulkTeamNames}
                      disabled={!teamNameBulkText.trim()}
                      className="px-4 py-2 bg-neon hover:not-disabled:bg-emerald-500 text-white dark:text-black rounded-md text-sm font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      {t('teamNames.bulkAddButton')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Team Names Chips List */}
            <div className="min-h-[80px] p-3.5 bg-elevated border border-bd-base rounded-lg">
              {customTeamNames.length === 0 ? (
                <p className="text-sm text-tx-muted text-center py-5">
                  {t('teamNames.empty')}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  <AnimatePresence>
                    {customTeamNames.map((name, index) => (
                      <motion.span
                        key={`${name}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-bd-base text-tx-primary text-sm sm:text-base rounded-md shadow-xs"
                      >
                        <span className="font-medium">{name}</span>
                        <button
                          type="button"
                          onClick={() => removeTeamName(index)}
                          className="text-tx-muted hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                          aria-label={`Remover ${name}`}
                        >
                          <X size={15} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {customTeamNamesError && participants.length >= 2 && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                {customTeamNamesError}
              </p>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={generate}
            disabled={!isValid || participants.length < 2}
            className="w-full py-3.5 px-6 bg-blue-600 hover:not-disabled:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-base sm:text-lg font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Shuffle size={20} />
            <span>{t('button.generate')}</span>
          </button>
        </div>
      </div>

      {/* 3. GENERATED TEAMS RESULTS */}
      <AnimatePresence mode="wait">
        {teams.length > 0 && (
          <motion.div
            key={key}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="space-y-4 pt-2"
          >
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-tx-primary">
                {t('results.title')} ({teams.length})
              </h3>
              <button
                type="button"
                onClick={copy}
                className="px-3.5 py-2 text-sm font-semibold text-tx-primary hover:text-neon bg-elevated hover:bg-surface border border-bd-base hover:border-bd-neon/40 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={16} className="text-neon" /> : <Copy size={16} />}
                <span>{copied ? t('results.copied') : t('results.copyAll')}</span>
              </button>
            </div>

            {/* Notice when teams have uneven distribution */}
            {hasAnySmallerTeam && (
              <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/35 rounded-lg p-3.5 flex items-center gap-2.5">
                <span className="shrink-0 text-base">⚠️</span>
                <span>{t('results.balancedNotice')}</span>
              </div>
            )}

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, i) => {
                const maxSize = Math.max(...teams.map((t) => t.members.length))
                const minSize = Math.min(...teams.map((t) => t.members.length))
                const smaller = maxSize > minSize && team.members.length < maxSize
                const accent = TEAM_ACCENTS[i % TEAM_ACCENTS.length]

                return (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    className={`rounded-xl bg-surface border border-bd-base p-4 sm:p-5 shadow-xs flex flex-col justify-between ${accent.border}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-bd-base">
                        <div
                          title={team.name}
                          className="font-bold text-base sm:text-lg text-tx-primary truncate max-w-[220px] sm:max-w-[280px]"
                        >
                          {team.name}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {smaller ? (
                            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35">
                              ⚠️ {t('results.fewerMembers', { count: team.members.length })}
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md bg-elevated border border-bd-base text-tx-secondary">
                              {t('results.memberCount', { count: team.members.length })}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.ul
                        variants={{
                          visible: {
                            transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                          },
                        }}
                        className="space-y-2"
                      >
                        {team.members.map((name, memberIdx) => (
                          <motion.li
                            key={`${name}-${memberIdx}`}
                            variants={nameVariants}
                            className="text-sm sm:text-base flex items-center gap-2.5 font-medium text-tx-primary py-0.5"
                          >
                            <span className="w-6 h-6 rounded-full bg-elevated border border-bd-base flex items-center justify-center text-xs font-bold text-tx-secondary shrink-0">
                              {memberIdx + 1}
                            </span>
                            <span className="truncate">{name}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
