'use client'
import { useState, useReducer } from 'react'

type Side = 'heads' | 'tails'

interface State {
  result: Side | null
  isFlipping: boolean
  history: Side[]
  rotation: number
}

type Action =
  | { type: 'FLIP_START' }
  | { type: 'FLIP_END'; result: Side; rotation: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FLIP_START':
      return { ...state, isFlipping: true }
    case 'FLIP_END':
      return {
        ...state,
        isFlipping: false,
        result: action.result,
        rotation: action.rotation,
        history: [action.result, ...state.history].slice(0, 10),
      }
    default:
      return state
  }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CoinFlip() {
  const [state, dispatch] = useReducer(reducer, {
    result: null, isFlipping: false, history: [], rotation: 0,
  })

  const flip = () => {
    if (state.isFlipping) return
    const result: Side = Math.random() < 0.5 ? 'heads' : 'tails'

    if (prefersReducedMotion()) {
      dispatch({ type: 'FLIP_START' })
      setTimeout(() => {
        const finalRotation = result === 'heads' ? 0 : 180
        dispatch({ type: 'FLIP_END', result, rotation: finalRotation })
      }, 50)
    } else {
      dispatch({ type: 'FLIP_START' })
      const extraSpins = (Math.floor(Math.random() * 3) + 2) * 360
      const finalRotation = state.rotation + extraSpins + (result === 'heads' ? 0 : 180)
      setTimeout(() => {
        dispatch({ type: 'FLIP_END', result, rotation: finalRotation })
      }, 700)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Coin */}
      <div className="w-40 h-40 perspective-1000" style={{ perspective: '1000px' }}>
        <div
          className="w-full h-full relative transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${state.rotation}deg)`,
          }}
        >
          {/* Heads */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-900 bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-600 shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            H
          </div>
          {/* Tails */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold text-gray-700 bg-gradient-to-br from-gray-300 to-gray-400 border-4 border-gray-500 shadow-lg"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            T
          </div>
        </div>
      </div>

      {state.result && !state.isFlipping && (
        <div className="text-2xl font-bold text-gray-800 capitalize">{state.result}!</div>
      )}

      <button
        onClick={flip}
        disabled={state.isFlipping}
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {state.isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>

      {state.history.length > 0 && (
        <div className="w-full">
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
