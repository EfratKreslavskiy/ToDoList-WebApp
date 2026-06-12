<script setup lang="ts">
import { LIST_COLORS, getColorOption } from '@/constants/colors'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [colorId: string]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <button
      v-for="color in LIST_COLORS"
      :key="color.id"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      :class="[
        color.buttonClass,
        getColorOption(props.modelValue).id === color.id ? 'ring-2 ring-slate-950 ring-offset-2 ring-offset-white' : ''
      ]"
      :aria-pressed="getColorOption(props.modelValue).id === color.id"
      :aria-label="`Select ${color.label} background color`"
      @click="emit('select', color.id)"
    >
      <span class="h-3 w-3 rounded-full border border-black/40" :class="color.dotClass"></span>
      {{ color.label }}
    </button>
  </div>
</template>
