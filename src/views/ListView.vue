<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ColorPicker from '@/components/ColorPicker.vue'
import TaskSection from '@/components/TaskSection.vue'
import { LIST_COLORS, getColorOption } from '@/constants/colors'
import { getOrderedTasks } from '@/lib/taskOrder'
import { todoStore } from '@/store/todoStore'

const route = useRoute()
const router = useRouter()

const editingTaskId = ref<string | null>(null)
const listId = computed(() => String(route.params.id ?? ''))
const list = computed(() => todoStore.getListById(listId.value) ?? null)
const titleDraft = ref('')

const orderedTasks = computed(() => getOrderedTasks(list.value?.tasks ?? []))
const colorOption = computed(() => getColorOption(list.value?.colorId ?? LIST_COLORS[0].id))

function syncTitleDraft(): void {
  titleDraft.value = list.value?.title ?? ''
}

watch(list, syncTitleDraft, { immediate: true })

watch(
  list,
  (nextList) => {
    if (!nextList) {
      router.replace({ name: 'home' })
    }
  },
  { immediate: true }
)

function goHome(): void {
  router.push({ name: 'home' })
}

function saveTitle(): void {
  if (!list.value) {
    return
  }

  const wasSaved = todoStore.updateListTitle(list.value.id, titleDraft.value)
  if (!wasSaved) {
    router.replace({ name: 'home' })
  }
}

function updateColor(colorId: string): void {
  if (!list.value) {
    return
  }

  todoStore.updateListColor(list.value.id, colorId)
}

function addTask(): void {
  if (!list.value) {
    return
  }

  const newTaskId = todoStore.addTask(list.value.id)
  editingTaskId.value = newTaskId
}

function startEditing(taskId: string): void {
  editingTaskId.value = taskId
}

function commitTaskText(taskId: string, text: string): void {
  if (!list.value) {
    return
  }

  const wasUpdated = todoStore.updateTaskText(list.value.id, taskId, text)
  if (editingTaskId.value === taskId) {
    editingTaskId.value = null
  }

  if (!wasUpdated) {
    return
  }
}

function deleteTask(taskId: string): void {
  if (!list.value) {
    return
  }

  todoStore.deleteTask(list.value.id, taskId)
  if (editingTaskId.value === taskId) {
    editingTaskId.value = null
  }
}

function toggleCompleted(taskId: string): void {
  if (!list.value) {
    return
  }

  todoStore.toggleTaskCompleted(list.value.id, taskId)
}

function toggleImportant(taskId: string): void {
  if (!list.value) {
    return
  }

  todoStore.toggleTaskImportant(list.value.id, taskId)
}

function reorderTasks(orderedTaskIds: string[]): void {
  if (!list.value) {
    return
  }

  todoStore.reorderTasks(list.value.id, orderedTaskIds)
}

async function copyList(): Promise<void> {
  if (!list.value) {
    return
  }

  await todoStore.copyList(list.value.id)
}

onMounted(() => {
  syncTitleDraft()
})
</script>

<template>
  <section v-if="list" class="space-y-6">
    <div
      class="rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
      :class="[colorOption.cardClass, colorOption.borderClass]"
    >
      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div class="min-w-0 flex-1 space-y-4">
          <div class="flex flex-wrap items-start gap-3">
          </div>

          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-700">List title</p>
            <input
              v-model="titleDraft"
              type="text"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-3xl font-semibold tracking-tight text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Untitled List"
              @blur="saveTitle"
            />
          </div>

          <p class="text-sm text-slate-800">
            {{ list.tasks.length }} task{{ list.tasks.length === 1 ? '' : 's' }} total ·
            {{ list.tasks.filter((task) => !task.completed).length }} incomplete
          </p>
        </div>

        <div class="rounded-[1.5rem] border border-slate-300 bg-white/90 p-4 shadow-sm xl:w-[24rem]">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Background color</p>
          <div class="mt-3">
            <ColorPicker :model-value="list.colorId" @select="updateColor" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between rounded-[1.5rem] border border-slate-300 bg-white px-4 py-4 shadow-sm">
      <div>
        <h3 class="text-lg font-semibold text-slate-900">List Items</h3>
        <p class="text-sm text-slate-700">Important items stay at the top. Drag within this single section to reorder tasks.</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click="addTask"
      >
        Add New Task
      </button>
    </div>

    <TaskSection
      title="List Items"
      :tasks="orderedTasks"
      empty-message="No tasks yet. Add a task to get started."
      :editing-task-id="editingTaskId"
      @reorder="reorderTasks"
      @start-edit="startEditing"
      @cancel-edit="editingTaskId = null"
      @commit-text="commitTaskText"
      @delete="deleteTask"
      @toggle-completed="toggleCompleted"
      @toggle-important="toggleImportant"
    />
  </section>

  <section v-else class="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-700 shadow-sm">
    <h2 class="text-xl font-semibold text-slate-900">List not found</h2>
    <p class="mt-2 text-sm">This list may have been deleted or the link is no longer valid.</p>
    <button
      type="button"
      class="mt-5 inline-flex items-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      @click="goHome"
    >
      Back to Home
    </button>
  </section>
</template>
