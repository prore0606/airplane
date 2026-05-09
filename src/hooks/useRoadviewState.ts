import { useState } from 'react'
import type { RouteStep } from '../types/foreigner'

export function useRoadviewState(steps: RouteStep[]) {
  const [index, setIndex] = useState(0)

  const total       = steps.length
  const currentStep = steps[index]
  const isFirst     = index === 0
  const isLast      = index === total - 1
  const progress    = total > 0 ? ((index + 1) / total) * 100 : 0

  function goNext() {
    if (!isLast) setIndex(i => i + 1)
  }

  function goPrev() {
    if (!isFirst) setIndex(i => i - 1)
  }

  function jumpTo(i: number) {
    if (i >= 0 && i < total) setIndex(i)
  }

  return { currentStep, index, total, isFirst, isLast, progress, goNext, goPrev, jumpTo }
}
