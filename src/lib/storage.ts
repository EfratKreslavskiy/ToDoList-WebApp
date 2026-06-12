import type { AppStorageState, TodoList } from '@/types'

const STORAGE_KEY = 'todo-list-web-app-state-v1'

export interface StorageLoadResult {
  lists: TodoList[]
  error: string | null
}

export function loadLists(): StorageLoadResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { lists: [], error: null }
    }

    const parsed = JSON.parse(raw) as Partial<AppStorageState>
    if (!parsed || !Array.isArray(parsed.lists)) {
      return {
        lists: [],
        error: 'Saved data was invalid and has been reset.'
      }
    }

    return {
      lists: parsed.lists,
      error: null
    }
  } catch {
    return {
      lists: [],
      error: 'Local Storage could not be read. Your changes will stay in memory for this session.'
    }
  }
}

export function saveLists(lists: TodoList[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lists }))
}
