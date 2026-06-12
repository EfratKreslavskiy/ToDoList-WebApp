<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const cancelButtonRef = ref<HTMLButtonElement | null>(null)

function focusFirstControl(): void {
  nextTick(() => {
    cancelButtonRef.value?.focus()
  })
}

function closeDialog(): void {
  emit('cancel')
}

function handleKeydown(event: KeyboardEvent): void {
  if (!props.open) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDialog()
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = dialogRef.value?.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  if (!focusableElements?.length) {
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  const activeElement = document.activeElement

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      focusFirstControl()
    }
  }
)

onBeforeUnmount(() => {
  cancelButtonRef.value = null
  dialogRef.value = null
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="props.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 py-6 backdrop-blur-sm"
        @click.self="closeDialog"
        @keydown="handleKeydown"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'confirm-dialog-title'"
          :aria-describedby="'confirm-dialog-message'"
          class="w-full max-w-lg rounded-[2rem] border border-slate-300 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.25)]"
        >
          <h2 id="confirm-dialog-title" class="text-xl font-semibold tracking-tight text-slate-900">
            {{ props.title }}
          </h2>
          <p id="confirm-dialog-message" class="mt-3 text-sm leading-6 text-slate-700">
            {{ props.message }}
          </p>

          <div class="mt-6 flex flex-wrap justify-end gap-3">
            <button
              ref="cancelButtonRef"
              type="button"
              class="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              @click="closeDialog"
            >
              {{ props.cancelLabel }}
            </button>
            <button
              type="button"
              class="inline-flex items-center rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              @click="$emit('confirm')"
            >
              {{ props.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.18s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
