const FLAG_EVAL_URL = process.env.FLAG_EVAL_URL
const FLAG_SDK_KEY = process.env.FLAG_SDK_KEY

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

export async function getFlags(): Promise<Record<string, boolean>> {
  if (!FLAG_EVAL_URL || !FLAG_SDK_KEY) return {}
  try {
    const res = await fetch(`${FLAG_EVAL_URL}/evaluate`, {
      headers: { 'x-sdk-key': FLAG_SDK_KEY },
      next: { revalidate: 30 },
    })
    if (!res.ok) return {}
    const data: unknown = await res.json()
    if (!isRecord(data) || !isRecord(data.flags)) return {}
    return Object.fromEntries(
      Object.entries(data.flags).filter(([, v]) => typeof v === 'boolean')
    ) as Record<string, boolean>
  } catch {
    return {}
  }
}

export async function getFlag(key: string): Promise<boolean> {
  const flags = await getFlags()
  return flags[key] === true
}
