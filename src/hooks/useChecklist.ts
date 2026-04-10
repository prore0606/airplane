import { useState, useEffect, useCallback } from 'react'

export interface ChecklistItem {
  id: string
  text: string
  category: '서류' | '짐' | '결제' | '건강' | '기타'
  done: boolean
  isDefault?: boolean
}

const STORAGE_KEY = 'airmate_checklist'

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: 'd1', text: '여권 (유효기간 6개월 이상)', category: '서류', done: false, isDefault: true },
  { id: 'd2', text: '항공권 e-티켓', category: '서류', done: false, isDefault: true },
  { id: 'd3', text: '여행자 보험 가입 확인', category: '서류', done: false, isDefault: true },
  { id: 'd4', text: '목적지 비자 확인', category: '서류', done: false, isDefault: true },
  { id: 'd5', text: '환전 또는 트래블카드', category: '결제', done: false, isDefault: true },
  { id: 'd6', text: '로밍 또는 현지 유심 준비', category: '결제', done: false, isDefault: true },
  { id: 'd7', text: '보조배터리 (기내 반입용)', category: '짐', done: false, isDefault: true },
  { id: 'd8', text: '충전기 및 멀티어댑터', category: '짐', done: false, isDefault: true },
  { id: 'd9', text: '상비약 챙기기', category: '건강', done: false, isDefault: true },
]

function load(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_ITEMS.map((i) => ({ ...i }))
}

function save(items: ChecklistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(load)

  useEffect(() => {
    save(items)
  }, [items])

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }, [])

  const addItem = useCallback((text: string, category: ChecklistItem['category'] = '기타') => {
    if (!text.trim()) return
    const item: ChecklistItem = {
      id: `u_${Date.now()}`,
      text: text.trim(),
      category,
      done: false,
    }
    setItems((prev) => [...prev, item])
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const reset = useCallback(() => {
    const fresh = DEFAULT_ITEMS.map((i) => ({ ...i, done: false }))
    setItems(fresh)
  }, [])

  const doneCount = items.filter((i) => i.done).length
  const totalCount = items.length

  return { items, toggle, addItem, removeItem, reset, doneCount, totalCount }
}
