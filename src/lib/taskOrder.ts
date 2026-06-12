import type { TodoTask } from '@/types'

export function getOrderedTasks(tasks: TodoTask[]): TodoTask[] {
  return [...tasks].sort((left, right) => {
    const importanceDifference = getImportanceRank(left) - getImportanceRank(right)
    if (importanceDifference !== 0) {
      return importanceDifference
    }

    const orderDifference = left.order - right.order
    if (orderDifference !== 0) {
      return orderDifference
    }

    return left.createdAt - right.createdAt
  })
}

export function getImportanceRank(task: TodoTask): number {
  return task.important ? 0 : 1
}

export function getIncompleteCount(tasks: TodoTask[]): number {
  return tasks.filter((task) => !task.completed).length
}
