<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link
          to="/"
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
        >
          📦 Parcel Tracker
        </router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
