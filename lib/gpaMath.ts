export type GradeScale = 'us4' | 'pt20' | 'es10'

export interface CourseEntry {
  grade: number
  credits: number
}

export interface GpaResult {
  gpa: number
  totalCredits: number
  letterGrade?: string
}

export function calculateGpa(courses: CourseEntry[], scale: GradeScale): GpaResult {
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0)
  if (totalCredits === 0) return { gpa: 0, totalCredits: 0 }
  const weightedSum = courses.reduce((s, c) => s + c.grade * c.credits, 0)
  const gpa = weightedSum / totalCredits
  return { gpa: parseFloat(gpa.toFixed(2)), totalCredits }
}

export function calculateCumulative(
  currentGpa: number,
  currentCredits: number,
  newGpa: number,
  newCredits: number
): number {
  const totalCredits = currentCredits + newCredits
  if (totalCredits === 0) return 0
  return parseFloat(
    ((currentGpa * currentCredits + newGpa * newCredits) / totalCredits).toFixed(2)
  )
}

export function calculateGradeNeeded(
  currentGrade: number,
  earnedWeight: number,
  targetGrade: number
): number {
  const remainingWeight = 100 - earnedWeight
  if (remainingWeight <= 0) return NaN
  const needed =
    (targetGrade - currentGrade * (earnedWeight / 100)) / (remainingWeight / 100)
  return parseFloat(needed.toFixed(2))
}

export function getGpaCategory(gpa: number, scale: GradeScale): string {
  if (scale === 'us4') {
    if (gpa >= 3.7) return 'A'
    if (gpa >= 3.3) return 'A-'
    if (gpa >= 3.0) return 'B+'
    if (gpa >= 2.7) return 'B'
    if (gpa >= 2.3) return 'B-'
    if (gpa >= 2.0) return 'C'
    if (gpa >= 1.0) return 'D'
    return 'F'
  }
  if (scale === 'pt20') {
    if (gpa >= 18) return 'Excelente'
    if (gpa >= 14) return 'Bom'
    if (gpa >= 10) return 'Suficiente'
    return 'Reprovado'
  }
  // es10
  if (gpa >= 9) return 'Sobresaliente'
  if (gpa >= 7) return 'Notable'
  if (gpa >= 5) return 'Aprobado'
  return 'Suspenso'
}
