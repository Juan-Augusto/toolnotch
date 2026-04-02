export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
}

export interface BirthdayCountdown {
  daysUntil: number
  nextBirthdayDate: Date
  isToday: boolean
}

export function calculateAge(birthdate: Date, referenceDate: Date = new Date()): AgeResult {
  let years = referenceDate.getFullYear() - birthdate.getFullYear()
  let months = referenceDate.getMonth() - birthdate.getMonth()
  let days = referenceDate.getDate() - birthdate.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor((referenceDate.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24))
  return { years, months, days, totalDays }
}

export function nextBirthday(birthdate: Date, today: Date = new Date()): BirthdayCountdown {
  const thisYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate())
  let next: Date
  if (thisYear >= today) {
    next = thisYear
  } else {
    next = new Date(today.getFullYear() + 1, birthdate.getMonth(), birthdate.getDate())
  }
  const daysUntil = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return { daysUntil, nextBirthdayDate: next, isToday: daysUntil === 0 }
}
