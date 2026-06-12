export interface TodoTask {
  id: string
  text: string
  completed: boolean
  important: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export interface TodoList {
  id: string
  title: string
  colorId: string
  order: number
  tasks: TodoTask[]
  createdAt: number
  updatedAt: number
}

export interface AppStorageState {
  lists: TodoList[]
}
