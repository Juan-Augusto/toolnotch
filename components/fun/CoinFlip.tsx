'use client'
import { useState, useReducer } from 'react'
import dynamic from 'next/dynamic'

const CoinFlip3D = dynamic(() => import('./CoinFlip3D'), { ssr: false })

type Side = 'heads' | 'tails'

interface State {
  result: Side | null
  isFlipping: boolean
  history: Side[]
}

type Action =
  | { type: 'FLIP_START' }
  | { type: 'FLIP_END'; result: Side }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FLIP_START':
      return { ...state, isFlipping: true }
    case 'FLIP_END':
      return {
        ...state,
        isFlipping: false,
        result: action.result,
        history: [action.result, ...state.history].slice(0, 10),
      }
    default:
      return state
  }
}

export default function CoinFlip() {
  const [state, dispatch] = useReducer(reducer, {
    result: null, isFlipping: false, history: [],
  })

  // pending result — determined before animation starts
  const [pendingResult, setPendingResult] = useState<Side>('heads')

  const flip = () => {
    if (state.isFlipping) return
    const result: Side = Math.random() < 0.5 ? 'heads' : 'tails'
    setPendingResult(result)
    dispatch({ type: 'FLIP_START' })
  }

  const handleAnimationDone = () => {
    dispatch({ type: 'FLIP_END', result: pendingResult })
  }

  // The 3D scene always shows the pending or settled result
  const displaySide = state.isFlipping ? pendingResult : (state.result ?? 'heads')

  return (
    <div className="flex flex-col items-center gap-5">
      {/* 3D coin */}
      <div className="w-full max-w-xs">
        <CoinFlip3D
          side={displaySide}
          flipping={state.isFlipping}
          onDone={handleAnimationDone}
        />
      </div>

      {/* Result label */}
      {state.result && !state.isFlipping && (
        <div className="text-2xl font-bold text-gray-800 capitalize">
          {state.result}!
        </div>
      )}

      {/* Flip button */}
      <button
        onClick={flip}
        disabled={state.isFlipping}
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {state.isFlipping ? 'Flipping…' : 'Flip Coin'}
      </button>

      {/* History */}
      {state.history.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-sm text-gray-500 mb-2">History (last {state.history.length}):</p>
          <div className="flex flex-wrap gap-2">
            {state.history.map((side, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm font-medium ${side === 'heads' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}
              >
                {side}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
