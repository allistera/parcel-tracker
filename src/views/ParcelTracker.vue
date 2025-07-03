<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Track Your Parcel
      </h1>

      <TrackingInput
        :initial-tracking-number="initialTrackingNumber"
        @track-parcel="handleTrackParcel"
      />
    </div>

    <div v-if="trackingData" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <ParcelTimeline :tracking-data="trackingData" />
    </div>
  </div>
</template>

<script>
import TrackingInput from '../components/TrackingInput.vue'
import ParcelTimeline from '../components/ParcelTimeline.vue'

export default {
  name: 'ParcelTracker',
  components: {
    TrackingInput,
    ParcelTimeline
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      trackingData: null,
      initialTrackingNumber: ''
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.initialTrackingNumber = newId
          this.handleTrackParcel(newId)
        }
      }
    },
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.initialTrackingNumber) {
          this.initialTrackingNumber = newId
          this.handleTrackParcel(newId)
        } else if (!newId) {
          this.initialTrackingNumber = ''
          this.trackingData = null
        }
      }
    }
  },
  methods: {
    handleTrackParcel(trackingNumber) {
      // update the input value immediately so the route watcher
      // doesn't trigger another fetch when the URL changes
      this.initialTrackingNumber = trackingNumber

      // fetch mock tracking data for the provided number
      this.trackingData = this.getMockTrackingData(trackingNumber)

      if (this.$route.params.id !== trackingNumber) {
        this.$router.push({ name: 'track', params: { id: trackingNumber } })
      }
    },
    getMockTrackingData(trackingNumber) {
      const statuses = [
        {
          status: 'Order Placed',
          date: '2024-01-15',
          time: '09:30 AM',
          description: 'Your order has been received and is being processed.',
          location: 'Online'
        },
        {
          status: 'Package Prepared',
          date: '2024-01-16',
          time: '02:15 PM',
          description: 'Your package has been prepared and is ready for pickup.',
          location: 'Warehouse - New York'
        },
        {
          status: 'In Transit',
          date: '2024-01-17',
          time: '06:00 AM',
          description: 'Your package is on its way to the destination.',
          location: 'Sorting Facility - Philadelphia'
        },
        {
          status: 'Out for Delivery',
          date: '2024-01-18',
          time: '08:30 AM',
          description: 'Your package is out for delivery and will arrive today.',
          location: 'Local Delivery Hub'
        }
      ]

      return {
        trackingNumber,
        currentStatus: 'Out for Delivery',
        estimatedDelivery: '2024-01-18',
        timeline: statuses
      }
    }
  }
}
</script>
