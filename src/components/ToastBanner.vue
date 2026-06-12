<script setup lang="ts">
interface Props {
  kind: 'success' | 'error' | 'info'
  message: string
}

const props = defineProps<Props>()

const toneClasses = {
  success: 'border-emerald-400 bg-emerald-100 text-emerald-950',
  error: 'border-red-400 bg-red-100 text-red-950',
  info: 'border-blue-400 bg-blue-100 text-blue-950'
} as const
</script>

<template>
  <div
    class="rounded-2xl border px-4 py-3 text-sm shadow-sm backdrop-blur"
    :class="toneClasses[props.kind]"
    role="status"
    aria-live="polite"
  >
    {{ props.message }}
  </div>
</template>
