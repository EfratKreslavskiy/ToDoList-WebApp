import type { TodoList } from '@/types'

export function formatListAsPlainText(list: TodoList): string {
  const title = list.title.trim() || 'Untitled List'
  const lines: string[] = [title, '']

  for (const task of list.tasks) {
    const status = task.completed ? '[x]' : '[ ]'
    const importance = task.important ? '★ ' : ''
    lines.push(`${status} ${importance}${task.text}`.trimEnd())
  }

  return lines.join('\n').trimEnd()
}
