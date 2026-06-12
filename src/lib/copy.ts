import type { TodoList } from '@/types'

import { getOrderedTasks } from '@/lib/taskOrder'

export function buildReadableListText(list: TodoList): string {
  const title = list.title.trim() || 'Untitled List'
  const tasks = getOrderedTasks(list.tasks)
  const lines: string[] = [title]

  if (!tasks.length) {
    lines.push('No tasks yet')
    return lines.join('\n')
  }

  lines.push('')
  lines.push('Tasks')

  for (const task of tasks) {
    const completionMark = task.completed ? 'x' : ' '
    const importanceMark = task.important ? ' ★' : ''
    lines.push(`- [${completionMark}] ${task.text}${importanceMark}`)
  }

  return lines.join('\n')
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const helper = document.createElement('textarea')
  helper.value = text
  helper.setAttribute('readonly', 'true')
  helper.style.position = 'fixed'
  helper.style.left = '-9999px'
  document.body.append(helper)
  helper.select()

  const didCopy = document.execCommand('copy')
  helper.remove()

  if (!didCopy) {
    throw new Error('Copy to clipboard failed.')
  }
}
