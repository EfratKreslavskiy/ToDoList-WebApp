<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

import ToastBanner from '@/components/ToastBanner.vue'
import { todoStore } from '@/store/todoStore'

const route = useRoute()
const store = todoStore.state
</script>

<template>
  <div class="theme-light min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_44%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-900">
    <div class="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <header class="mb-6 rounded-[2rem] border border-slate-300 bg-white/90 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">ToDoList Web App</p>
            <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Personal Task Planning
            </h1>
          </div>
          <nav class="flex flex-wrap items-center gap-3">
            <RouterLink
              to="/"
              class="inline-flex items-center rounded-full border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Home
            </RouterLink>
            <span
              v-if="route.name === 'list'"
              class="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900"
            >
              List view
            </span>
          </nav>
        </div>
      </header>

      <ToastBanner v-if="store.flash" class="mb-4" :kind="store.flash.kind" :message="store.flash.text" />

      <div
        v-if="store.storageError"
        class="mb-4 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-950 shadow-sm"
        role="status"
        aria-live="polite"
      >
        {{ store.storageError }}
      </div>

      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>
