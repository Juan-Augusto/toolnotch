export interface ShareConfig {
  url: string
  title: string
  text: string
}

export interface DiceNotation {
  count: number
  sides: number
  modifier: number
}

export interface DiceRoll {
  notation: string
  rolls: number[]
  sum: number
  total: number
}
