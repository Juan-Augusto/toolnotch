export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalMonths: number
  totalWeeks: number
  totalHours: number
}

export interface BirthdayCountdown {
  daysUntil: number
  nextBirthdayDate: Date
  isToday: boolean
}

export function calculateAge(birthdate: Date, referenceDate: Date = new Date()): AgeResult {
  const b = new Date(birthdate.getFullYear(), birthdate.getMonth(), birthdate.getDate())
  const r = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())

  let years = r.getFullYear() - b.getFullYear()
  let months = r.getMonth() - b.getMonth()
  let days = r.getDate() - b.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(r.getFullYear(), r.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.max(0, Math.floor((r.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)))
  const totalMonths = Math.max(0, years * 12 + months)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24

  return { years, months, days, totalDays, totalMonths, totalWeeks, totalHours }
}

export function nextBirthday(birthdate: Date, today: Date = new Date()): BirthdayCountdown {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const thisYear = new Date(t.getFullYear(), birthdate.getMonth(), birthdate.getDate())

  let next: Date
  if (thisYear.getTime() === t.getTime()) {
    return { daysUntil: 0, nextBirthdayDate: thisYear, isToday: true }
  } else if (thisYear > t) {
    next = thisYear
  } else {
    next = new Date(t.getFullYear() + 1, birthdate.getMonth(), birthdate.getDate())
  }

  const daysUntil = Math.round((next.getTime() - t.getTime()) / (1000 * 60 * 60 * 24))
  return { daysUntil, nextBirthdayDate: next, isToday: daysUntil === 0 }
}
