<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Draggable from 'vuedraggable'

import ConfirmDialog from '@/components/ConfirmDialog.vue'
import ListCard from '@/components/ListCard.vue'
import { todoStore } from '@/store/todoStore'
import type { TodoList } from '@/types'

const router = useRouter()
const deleteTarget = ref<TodoList | null>(null)
const localLists = ref<TodoList[]>([])
const preDragOrderIds = ref<string[]>([])

interface DragReorderEvent {
  oldIndex?: number
  newIndex?: number
}

const lists = computed(() => todoStore.getSortedLists())

function syncLocalLists(): void {
  localLists.value = [...lists.value]
}

watch(lists, syncLocalLists, { immediate: true })

onMounted(() => {
  todoStore.cleanupBlankLists()
  syncLocalLists()
})

function handleReorder(): void {
  todoStore.reorderLists(localLists.value.map((list) => list.id))
  syncLocalLists()
}

function startReorder(): void {
  preDragOrderIds.value = localLists.value.map((list) => list.id)
}

function swapReorder(event: DragReorderEvent): void {
  const oldIndex = event.oldIndex ?? -1
  const newIndex = event.newIndex ?? -1
  if (
    oldIndex < 0 ||
    newIndex < 0 ||
    oldIndex >= localLists.value.length ||
    newIndex >= localLists.value.length ||
    oldIndex === newIndex
  ) {
    syncLocalLists()
    return
  }

  const baseline =
    preDragOrderIds.value.length === localLists.value.length
      ? [...preDragOrderIds.value]
      : localLists.value.map((list) => list.id)

  const sourceId = baseline[oldIndex]
  const targetId = baseline[newIndex]
  baseline[oldIndex] = targetId
  baseline[newIndex] = sourceId

  const listById = new Map(lists.value.map((list) => [list.id, list] as const))
  localLists.value = baseline
    .map((listId) => listById.get(listId))
    .filter((list): list is TodoList => Boolean(list))

  handleReorder()
}

function openList(listId: string): void {
  router.push({ name: 'list', params: { id: listId } })
}

function createList(): void {
  const newListId = todoStore.createList()
  router.push({ name: 'list', params: { id: newListId } })
}

async function copyList(listId: string): Promise<void> {
  await todoStore.copyList(listId)
}

function confirmDelete(): void {
  if (!deleteTarget.value) {
    return
  }

  todoStore.deleteList(deleteTarget.value.id)
  deleteTarget.value = null
  syncLocalLists()
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 rounded-[2rem] border border-slate-300 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">Home</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Your To-Do Lists</h2>
        <p class="mt-1 max-w-2xl text-sm text-slate-700">
          Create lists, organize tasks, and keep everything saved automatically in your browser.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click="createList"
      >
        Create New List
      </button>
    </div>

    <div v-if="lists.length">
      <Draggable
        v-model="localLists"
        item-key="id"
        class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        @start="startReorder"
        @end="swapReorder"
      >
        <template #item="{ element }">
          <ListCard
            :list="element"
            @open="openList(element.id)"
            @copy="copyList(element.id)"
            @delete="deleteTarget = element"
          />
        </template>
      </Draggable>
    </div>

    <div
      v-else
      class="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-700 shadow-sm"
    >
      <h3 class="text-lg font-semibold text-slate-900">No lists yet</h3>
      <p class="mt-2 text-sm">Create your first To-Do List to get started.</p>
    </div>

    <ConfirmDialog
      :open="Boolean(deleteTarget)"
      title="Delete To-Do List"
      message="Delete this list permanently. This action cannot be undone."
      confirm-label="Delete list"
      cancel-label="Keep list"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </section>
</template>
