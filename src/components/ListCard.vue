<script setup lang="ts">
import { computed } from 'vue'

import { getColorOption } from '@/constants/colors'
import type { TodoList } from '@/types'

interface Props {
  list: TodoList
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: []
  copy: []
  delete: []
}>()

const colorOption = computed(() => getColorOption(props.list.colorId))
const totalCount = computed(() => props.list.tasks.length)
const completeCount = computed(() => props.list.tasks.filter((task) => task.completed).length)
const displayTitle = computed(() => props.list.title.trim() || 'Untitled List')
</script>

<template>
  <article
    class="group flex h-full cursor-grab flex-col rounded-[2rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.45)] active:cursor-grabbing"
    :class="[colorOption.cardClass, colorOption.borderClass]"
  >
    <button
      type="button"
      class="flex-1 text-left"
      :aria-label="`Open ${displayTitle}`"
      @click="emit('open')"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-slate-950">{{ displayTitle }}</h3>
          <p class="mt-1 text-sm font-medium text-slate-700">
            {{ totalCount }} {{ totalCount === 1 ? 'task' : 'tasks' }}<template v-if="completeCount > 0"> | {{ completeCount }} complete</template>
          </p>
        </div>
        <span class="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
          List
        </span>
      </div>
    </button>

    <div class="mt-5 flex flex-wrap gap-2">
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-slate-400 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click.stop="emit('copy')"
      >
        Copy
      </button>
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-red-300 bg-red-200 px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click.stop="emit('delete')"
      >
        Delete
      </button>
    </div>
  </article>
</template>
