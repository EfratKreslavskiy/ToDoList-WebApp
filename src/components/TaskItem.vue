<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

import type { TodoTask } from '@/types'

interface Props {
  task: TodoTask
  editing: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  startEdit: []
  cancelEdit: []
  commitText: [text: string]
  delete: []
  toggleCompleted: []
  toggleImportant: []
}>()

const draft = ref(props.task.text)
const inputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.task.text,
  (text) => {
    if (!props.editing) {
      draft.value = text
    }
  }
)

watch(
  () => props.editing,
  (isEditing) => {
    if (isEditing) {
      draft.value = props.task.text
      nextTick(() => {
        inputRef.value?.focus()
        inputRef.value?.select()
      })
    }
  },
  { immediate: true }
)

function commit(): void {
  emit('commitText', draft.value)
}
</script>

<template>
  <article
    class="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-3 py-3 shadow-sm transition hover:border-slate-400 hover:shadow-md"
  >
    <button
      type="button"
      class="drag-handle inline-flex w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label="Drag task to reorder"
    >
      ⋮⋮
    </button>

    <div class="min-w-0 flex flex-1 items-center gap-2">
      <label class="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-2 py-2 text-slate-700 transition hover:bg-slate-200">
        <input
          class="h-4 w-4 rounded-md border-slate-500 text-blue-600 focus:ring-blue-600"
          type="checkbox"
          :checked="props.task.completed"
          :aria-label="props.task.completed ? 'Mark task as incomplete' : 'Mark task as complete'"
          @change="emit('toggleCompleted')"
        />
      </label>

      <button
        v-if="!props.editing"
        type="button"
        class="block w-full rounded-xl px-1 py-1 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        :class="props.task.completed ? 'text-slate-500 line-through' : ''"
        :aria-label="`Edit task ${props.task.text}`"
        @click="emit('startEdit')"
      >
        <span class="flex items-center gap-2">
          <span v-if="props.task.important" class="text-amber-700">★</span>
          <span class="truncate">{{ props.task.text }}</span>
        </span>
      </button>

      <input
        v-else
        ref="inputRef"
        v-model="draft"
        type="text"
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        placeholder="Task text"
        @blur="commit"
        @keydown.enter.prevent="commit"
        @keydown.esc.prevent="emit('cancelEdit')"
      />
    </div>

    <button
      type="button"
      class="inline-flex w-10 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      :class="props.task.important ? 'border-amber-500 bg-amber-200 text-amber-900' : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'"
      :aria-pressed="props.task.important"
      :aria-label="props.task.important ? 'Mark task as not important' : 'Mark task as important'"
      @click="emit('toggleImportant')"
    >
      ★
    </button>

    <button
      type="button"
      class="inline-flex shrink-0 items-center justify-center rounded-xl border border-red-300 bg-red-200 px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      aria-label="Delete task"
      @click="emit('delete')"
    >
      Delete
    </button>
  </article>
</template>
