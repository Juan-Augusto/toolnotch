'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  calculateGpa,
  calculateCumulative,
  getGpaCategory,
  type GradeScale,
  type CourseEntry,
} from '@/lib/gpaMath'

interface Props {
  mode: 'semester' | 'cumulative'
  locale: string
}

const SCALE_MAX: Record<GradeScale, number> = {
  us4: 4,
  pt20: 20,
  es10: 10,
}

function defaultScale(locale: string): GradeScale {
  if (locale === 'pt') return 'pt20'
  if (locale === 'es') return 'es10'
  return 'us4'
}

export default function GpaCalculator({ mode, locale }: Props) {
  const t = useTranslations('gpaCalculator')

  const [scale, setScale] = useState<GradeScale>(() => defaultScale(locale))

  // Semester mode state
  const [courses, setCourses] = useState<(CourseEntry & { id: number })[]>([
    { id: 1, grade: 0, credits: 3 },
  ])
  const [nextId, setNextId] = useState(2)

  // Cumulative mode state
  const [currentGpa, setCurrentGpa] = useState('')
  const [currentCredits, setCurrentCredits] = useState('')
  const [newGpa, setNewGpa] = useState('')
  const [newCredits, setNewCredits] = useState('')

  // Reset courses when scale changes to avoid out-of-range values
  function handleScaleChange(next: GradeScale) {
    setScale(next)
    setCourses([{ id: 1, grade: 0, credits: 3 }])
    setNextId(2)
  }

  // ── Semester helpers ──────────────────────────────────────────────────────
  function addCourse() {
    if (courses.length >= 20) return
    setCourses((prev) => [...prev, { id: nextId, grade: 0, credits: 3 }])
    setNextId((n) => n + 1)
  }

  function removeCourse(id: number) {
    if (courses.length <= 1) return
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  function updateCourse(id: number, field: 'grade' | 'credits', raw: string) {
    const value = parseFloat(raw)
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: isNaN(value) ? 0 : value } : c))
    )
  }

  // ── Derived results ───────────────────────────────────────────────────────
  const semesterResult = calculateGpa(courses, scale)
  const semesterCategory = semesterResult.totalCredits > 0
    ? getGpaCategory(semesterResult.gpa, scale)
    : null

  const cGpa = parseFloat(currentGpa)
  const cCred = parseFloat(currentCredits)
  const nGpa = parseFloat(newGpa)
  const nCred = parseFloat(newCredits)
  const cumulativeReady =
    !isNaN(cGpa) && !isNaN(cCred) && !isNaN(nGpa) && !isNaN(nCred) &&
    cCred >= 0 && nCred >= 0
  const cumulativeGpa = cumulativeReady
    ? calculateCumulative(cGpa, cCred, nGpa, nCred)
    : null
  const cumulativeCategory = cumulativeGpa !== null
    ? getGpaCategory(cumulativeGpa, scale)
    : null

  const maxGrade = SCALE_MAX[scale]

  return (
    <div className="space-y-6">
      {/* Grade scale selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('gradeScale')}
        </label>
        <select
          value={scale}
          onChange={(e) => handleScaleChange(e.target.value as GradeScale)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="us4">{t('scaleUs4')}</option>
          <option value="pt20">{t('scalePt20')}</option>
          <option value="es10">{t('scaleEs10')}</option>
        </select>
      </div>

      {mode === 'semester' ? (
        <>
          {/* Course rows */}
          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div key={course.id} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-6 shrink-0 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="number"
                  min={0}
                  max={maxGrade}
                  step={scale === 'us4' ? 0.1 : 1}
                  value={course.grade === 0 ? '' : course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  placeholder={`${t('grade')} (0–${maxGrade})`}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={course.credits === 3 && idx === courses.length - 1 && courses.length === 1 ? course.credits : course.credits}
                  onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  placeholder={t('credits')}
                  className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {courses.length > 1 && (
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 py-1 rounded shrink-0"
                  >
                    {t('removeCourse')}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add course button */}
          {courses.length < 20 && (
            <button
              onClick={addCourse}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
            >
              <span className="text-lg leading-none">+</span>
              {t('addCourse')}
            </button>
          )}

          {/* Semester result */}
          {semesterResult.totalCredits > 0 && (
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                    {t('yourGpa')}
                  </p>
                  <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                    {semesterResult.gpa}
                    {semesterCategory && (
                      <span className="ml-3 text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
                        {semesterCategory}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                    {t('totalCredits')}
                  </p>
                  <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {semesterResult.totalCredits}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Cumulative mode inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('currentGpa')}
              </label>
              <input
                type="number"
                min={0}
                max={maxGrade}
                step={0.01}
                value={currentGpa}
                onChange={(e) => setCurrentGpa(e.target.value)}
                placeholder={`0–${maxGrade}`}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('completedCredits')}
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={currentCredits}
                onChange={(e) => setCurrentCredits(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('newSemesterGpa')}
              </label>
              <input
                type="number"
                min={0}
                max={maxGrade}
                step={0.01}
                value={newGpa}
                onChange={(e) => setNewGpa(e.target.value)}
                placeholder={`0–${maxGrade}`}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('newSemesterCredits')}
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={newCredits}
                onChange={(e) => setNewCredits(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Cumulative result */}
          {cumulativeGpa !== null && (
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 p-5">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                {t('newCumulativeGpa')}
              </p>
              <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                {cumulativeGpa}
                {cumulativeCategory && (
                  <span className="ml-3 text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
                    {cumulativeCategory}
                  </span>
                )}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
