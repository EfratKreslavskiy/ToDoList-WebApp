import { reactive, watch } from 'vue'

import { DEFAULT_LIST_COLOR_ID } from '@/constants/colors'
import { buildReadableListText, copyTextToClipboard } from '@/lib/copy'
import { createId } from '@/lib/id'
import { loadLists, saveLists } from '@/lib/storage'
import type { TodoList, TodoTask } from '@/types'

interface FlashMessage {
  kind: 'success' | 'error' | 'info'
  text: string
}

function normalizeListOrder(lists: TodoList[]): TodoList[] {
  const withIndex = lists.map((list, index) => ({ list, index }))

  withIndex.sort((left, right) => {
    const leftOrder = Number.isFinite(left.list.order) ? left.list.order : left.index
    const rightOrder = Number.isFinite(right.list.order) ? right.list.order : right.index
    return leftOrder - rightOrder
  })

  return withIndex.map((entry, index) => ({
    ...entry.list,
    order: index
  }))
}

const loadedState = loadLists()

const state = reactive({
  lists: normalizeListOrder(loadedState.lists),
  flash: null as FlashMessage | null,
  storageError: loadedState.error
})

let flashTimer: ReturnType<typeof window.setTimeout> | null = null

function touchList(list: TodoList): void {
  list.updatedAt = Date.now()
}

function persistState(): void {
  try {
    const listsToSave = state.lists.filter((list) => !isBlankList(list))
    saveLists(listsToSave)
    state.storageError = null
  } catch {
    state.storageError = 'Local Storage could not save changes. Your edits remain in memory until the issue is resolved.'
  }
}

watch(
  () => state.lists,
  () => {
    persistState()
  },
  { deep: true }
)

function showFlash(kind: FlashMessage['kind'], text: string): void {
  if (flashTimer !== null) {
    window.clearTimeout(flashTimer)
  }

  state.flash = { kind, text }
  flashTimer = window.setTimeout(() => {
    state.flash = null
    flashTimer = null
  }, 2200)
}

function getListById(listId: string): TodoList | undefined {
  return state.lists.find((list) => list.id === listId)
}

function getSortedLists(): TodoList[] {
  return [...state.lists].sort((left, right) => left.order - right.order)
}

function isBlankList(list: TodoList): boolean {
  const isTitleBlank = !list.title.trim() || list.title === 'Untitled List'
  return isTitleBlank && list.tasks.length === 0
}

function cleanupBlankLists(): number {
  const before = state.lists.length
  state.lists = normalizeListOrder(state.lists.filter((list) => !isBlankList(list)))
  return before - state.lists.length
}

function getNextListOrder(): number {
  return state.lists.reduce((highest, list) => Math.max(highest, list.order), -1) + 1
}

function getNextTaskOrder(list: TodoList): number {
  return list.tasks.reduce((highest, task) => Math.max(highest, task.order), -1) + 1
}

function createList(): string {
  const now = Date.now()
  const list: TodoList = {
    id: createId('list'),
    title: 'Untitled List',
    colorId: DEFAULT_LIST_COLOR_ID,
    order: getNextListOrder(),
    tasks: [],
    createdAt: now,
    updatedAt: now
  }

  state.lists.push(list)
  reorderLists([list.id, ...getSortedLists().map((entry) => entry.id).filter((id) => id !== list.id)])
  showFlash('success', 'New list created.')
  return list.id
}

function updateListTitle(listId: string, rawTitle: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  list.title = rawTitle.trim()
  touchList(list)
  return true
}

function updateListColor(listId: string, colorId: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  list.colorId = colorId
  touchList(list)
  return true
}

function deleteList(listId: string): boolean {
  const index = state.lists.findIndex((list) => list.id === listId)
  if (index < 0) {
    return false
  }

  state.lists.splice(index, 1)
  state.lists = normalizeListOrder(state.lists)
  showFlash('info', 'List deleted.')
  return true
}

function reorderLists(orderedListIds: string[]): boolean {
  if (orderedListIds.length !== state.lists.length) {
    return false
  }

  const listById = new Map(state.lists.map((list) => [list.id, list] as const))
  if (orderedListIds.some((listId) => !listById.has(listId))) {
    return false
  }

  orderedListIds.forEach((listId, index) => {
    const list = listById.get(listId)
    if (!list) {
      return
    }

    list.order = index
  })

  state.lists = getSortedLists()
  return true
}

function addTask(listId: string): string | null {
  const list = getListById(listId)
  if (!list) {
    return null
  }

  const now = Date.now()
  const task: TodoTask = {
    id: createId('task'),
    text: '',
    completed: false,
    important: false,
    order: getNextTaskOrder(list),
    createdAt: now,
    updatedAt: now
  }

  list.tasks.push(task)
  touchList(list)
  return task.id
}

function updateTaskText(listId: string, taskId: string, rawText: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  const task = list.tasks.find((entry) => entry.id === taskId)
  if (!task) {
    return false
  }

  const nextText = rawText.trim()
  if (!nextText) {
    deleteTask(listId, taskId)
    return false
  }

  task.text = nextText
  task.updatedAt = Date.now()
  touchList(list)
  return true
}

function toggleTaskCompleted(listId: string, taskId: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  const task = list.tasks.find((entry) => entry.id === taskId)
  if (!task) {
    return false
  }

  task.completed = !task.completed
  task.updatedAt = Date.now()
  touchList(list)
  return true
}

function toggleTaskImportant(listId: string, taskId: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  const task = list.tasks.find((entry) => entry.id === taskId)
  if (!task) {
    return false
  }

  task.important = !task.important
  task.updatedAt = Date.now()
  touchList(list)
  return true
}

function deleteTask(listId: string, taskId: string): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  const index = list.tasks.findIndex((task) => task.id === taskId)
  if (index < 0) {
    return false
  }

  list.tasks.splice(index, 1)
  touchList(list)
  return true
}

function reorderTasks(listId: string, orderedTaskIds: string[]): boolean {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  const taskById = new Map(list.tasks.map((task) => [task.id, task] as const))

  orderedTaskIds.forEach((taskId, index) => {
    const task = taskById.get(taskId)
    if (!task) {
      return
    }

    task.order = index
    task.updatedAt = Date.now()
  })

  touchList(list)
  return true
}

async function copyList(listId: string): Promise<boolean> {
  const list = getListById(listId)
  if (!list) {
    return false
  }

  try {
    await copyTextToClipboard(buildReadableListText(list))
    showFlash('success', 'List copied to clipboard.')
    return true
  } catch {
    showFlash('error', 'Copy to clipboard failed.')
    return false
  }
}

export const todoStore = {
  state,
  createList,
  deleteList,
  getListById,
  getSortedLists,
  reorderLists,
  addTask,
  updateListColor,
  updateListTitle,
  updateTaskText,
  toggleTaskCompleted,
  toggleTaskImportant,
  deleteTask,
  reorderTasks,
  copyList,
  cleanupBlankLists,
  showFlash
}
