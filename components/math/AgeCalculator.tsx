'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { calculateAge, nextBirthday } from '@/lib/ageMath'

interface Props { locale: string }

export default function AgeCalculator({ locale }: Props) {
  const t = useTranslations('ageCalculator')
  const [birthdate, setBirthdate] = useState('')
  const [futureDate, setFutureDate] = useState('')

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const birthdateObj = birthdate ? new Date(birthdate + 'T00:00:00') : null
  const isValidBirthdate = birthdateObj && birthdateObj <= today

  const age = isValidBirthdate ? calculateAge(birthdateObj!, today) : null
  const bday = isValidBirthdate ? nextBirthday(birthdateObj!, today) : null

  const futureDateObj = futureDate && birthdateObj ? new Date(futureDate + 'T00:00:00') : null
  const futureAge = futureDateObj && birthdateObj && futureDateObj > birthdateObj
    ? calculateAge(birthdateObj!, futureDateObj)
    : null

  return (
    <div className="space-y-6">
      {/* Date of Birth input */}
      <div>
        <label className="block text-sm font-medium mb-1">{t('birthdate')}</label>
        <input
          type="date"
          max={todayStr}
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card px-3 py-2 text-base"
        />
        {birthdate && !isValidBirthdate && (
          <p className="text-red-500 text-sm mt-1">{t('errorFutureDate')}</p>
        )}
      </div>

      {/* Age Result */}
      {age && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('youAre')}</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{age.years}</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
            {t('yearsOld')}
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
            {age.months} {t('monthsWord')} · {age.days} {t('daysWord')}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t('totalDays', { total: age.totalDays.toLocaleString(locale) })}</p>
        </div>
      )}

      {/* Birthday countdown */}
      {bday && (
        <div className="rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 p-4 text-center">
          <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
            {bday.isToday ? t('happyBirthday') : t('nextBirthday')}
          </p>
          {!bday.isToday && (
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mt-1">
              {t('inDays', { n: bday.daysUntil })}
            </p>
          )}
          {!bday.isToday && (
            <p className="text-sm text-gray-500 mt-1">
              {bday.nextBirthdayDate.toLocaleDateString(locale, { day: 'numeric', month: 'long' })}
            </p>
          )}
        </div>
      )}

      {/* Future age section */}
      {isValidBirthdate && (
        <div>
          <label className="block text-sm font-medium mb-1">{t('futureAge')}</label>
          <input
            type="date"
            min={todayStr}
            value={futureDate}
            onChange={e => setFutureDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-card dark:bg-card px-3 py-2 text-base"
          />
          {futureAge && (
            <div className="mt-3 p-4 rounded-lg bg-gray-50 dark:bg-card border border-gray-200 dark:border-gray-700">
              <p className="text-center text-lg font-semibold">
                {t('futureResult', {
                  date: new Date(futureDate + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }),
                  years: futureAge.years,
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
