<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Tracking Number: {{ trackingData.trackingNumber }}
      </h2>
      <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <span class="flex items-center">
          <span
            class="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
          >
            {{ trackingData.currentStatus }}
          </span>
        </span>
        <span>Estimated Delivery: {{ formatDate(trackingData.estimatedDelivery) }}</span>
      </div>
    </div>

    <div class="relative">
      <div v-for="(item, index) in trackingData.timeline" :key="index" class="mb-8 relative">
        <div class="flex items-start">
          <div class="flex-shrink-0 relative">
            <div
              :class="getStatusIcon(index)"
              class="w-10 h-10 rounded-full flex items-center justify-center text-white relative z-10"
            >
              <svg
                v-if="index === trackingData.timeline.length - 1"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div
              v-if="index < trackingData.timeline.length - 1"
              class="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300 dark:bg-gray-600"
            ></div>
          </div>

          <div class="ml-6 flex-1">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ item.status }}
                </h3>
                <div class="text-right text-sm text-gray-500 dark:text-gray-400">
                  <div>{{ formatDate(item.date) }}</div>
                  <div>{{ item.time }}</div>
                </div>
              </div>

              <p class="text-gray-700 dark:text-gray-300 mb-2">
                {{ item.description }}
              </p>

              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ item.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParcelTimeline',
  props: {
    trackingData: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getStatusIcon(index) {
      if (index === this.trackingData.timeline.length - 1) {
        return 'bg-green-500'
      }
      return 'bg-blue-500'
    }
  }
}
</script>
