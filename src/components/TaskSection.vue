<script setup lang="ts">
import { ref, watch } from 'vue'
import Draggable from 'vuedraggable'

import TaskItem from '@/components/TaskItem.vue'
import type { TodoTask } from '@/types'

interface Props {
  title: string
  tasks: TodoTask[]
  emptyMessage: string
  editingTaskId: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reorder: [orderedTaskIds: string[]]
  startEdit: [taskId: string]
  cancelEdit: []
  commitText: [taskId: string, text: string]
  delete: [taskId: string]
  toggleCompleted: [taskId: string]
  toggleImportant: [taskId: string]
}>()

const localTasks = ref<TodoTask[]>([...props.tasks])

watch(
  () => props.tasks,
  (tasks) => {
    localTasks.value = [...tasks]
  },
  { deep: true }
)

function handleReorder(): void {
  emit('reorder', localTasks.value.map((task) => task.id))
}
</script>

<template>
  <section class="rounded-[2rem] border border-slate-300 bg-white p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-semibold uppercase tracking-[0.28em] text-slate-700">{{ props.title }}</h2>
        <p class="mt-1 text-sm text-slate-600">{{ props.tasks.length }} task{{ props.tasks.length === 1 ? '' : 's' }}</p>
      </div>
    </div>

    <div v-if="localTasks.length">
      <Draggable
        v-model="localTasks"
        item-key="id"
        handle=".drag-handle"
        class="space-y-3"
        @end="handleReorder"
      >
        <template #item="{ element }">
          <TaskItem
            :task="element"
            :editing="props.editingTaskId === element.id"
            @start-edit="emit('startEdit', element.id)"
            @cancel-edit="emit('cancelEdit')"
            @commit-text="emit('commitText', element.id, $event)"
            @delete="emit('delete', element.id)"
            @toggle-completed="emit('toggleCompleted', element.id)"
            @toggle-important="emit('toggleImportant', element.id)"
          />
        </template>
      </Draggable>
    </div>
    <div
      v-else
      class="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600"
    >
      {{ props.emptyMessage }}
    </div>
  </section>
</template>
