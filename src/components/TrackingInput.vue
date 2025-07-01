<template>
  <div class="max-w-md mx-auto">
    <form class="space-y-4" @submit.prevent="submitTracking">
      <div>
        <label
          for="tracking-number"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Enter Tracking Number
        </label>
        <input
          id="tracking-number"
          v-model="trackingNumber"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="e.g., 1Z999AA1234567890"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="!trackingNumber.trim() || loading"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Tracking...
        </span>
        <span v-else>Track Package</span>
      </button>
    </form>

    <div
      v-if="error"
      class="mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrackingInput',
  props: {
    initialTrackingNumber: {
      type: String,
      default: ''
    }
  },
  emits: ['track-parcel'],
  data() {
    return {
      trackingNumber: '',
      loading: false,
      error: null
    }
  },
  watch: {
    initialTrackingNumber: {
      immediate: true,
      handler(newValue) {
        this.trackingNumber = newValue || ''
      }
    }
  },
  methods: {
    async submitTracking() {
      if (!this.trackingNumber.trim()) return

      this.loading = true
      this.error = null

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.$emit('track-parcel', this.trackingNumber.trim())
      } catch (err) {
        this.error = 'Failed to track package. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
