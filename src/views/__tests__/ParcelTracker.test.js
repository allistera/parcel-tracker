import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ParcelTracker from '../ParcelTracker.vue'
import TrackingInput from '../../components/TrackingInput.vue'
import ParcelTimeline from '../../components/ParcelTimeline.vue'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: ParcelTracker },
    { path: '/track/:id?', name: 'track', component: ParcelTracker, props: true }
  ]
})

describe('ParcelTracker', () => {
  let wrapper

  beforeEach(async () => {
    router.push('/')
    await router.isReady()

    wrapper = mount(ParcelTracker, {
      global: {
        plugins: [router],
        stubs: {
          TrackingInput: true,
          ParcelTimeline: true
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Track Your Parcel')
    expect(wrapper.findComponent(TrackingInput).exists()).toBe(true)
  })

  it('does not show timeline initially', () => {
    expect(wrapper.findComponent(ParcelTimeline).exists()).toBe(false)
    expect(wrapper.vm.trackingData).toBeNull()
  })

  it('shows timeline after tracking a parcel', async () => {
    // Mock the router push to avoid navigation errors
    const mockPush = vi.fn()
    wrapper.vm.$router = { ...wrapper.vm.$router, push: mockPush }
    wrapper.vm.$route = { params: { id: null } }

    await wrapper.vm.handleTrackParcel('TEST123')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.trackingData).toBeTruthy()
    expect(wrapper.vm.trackingData.trackingNumber).toBe('TEST123')
    expect(wrapper.findComponent(ParcelTimeline).exists()).toBe(true)
  })

  it('generates mock tracking data correctly', () => {
    const trackingData = wrapper.vm.getMockTrackingData('ABC123')

    expect(trackingData.trackingNumber).toBe('ABC123')
    expect(trackingData.currentStatus).toBe('Out for Delivery')
    expect(trackingData.estimatedDelivery).toBe('2024-01-18')
    expect(trackingData.timeline).toHaveLength(4)

    const expectedStatuses = ['Order Placed', 'Package Prepared', 'In Transit', 'Out for Delivery']
    trackingData.timeline.forEach((item, index) => {
      expect(item.status).toBe(expectedStatuses[index])
      expect(item.description).toBeTruthy()
      expect(item.location).toBeTruthy()
      expect(item.date).toBeTruthy()
      expect(item.time).toBeTruthy()
    })
  })

  it('passes initial tracking number to TrackingInput component', async () => {
    // Mock router push to avoid navigation errors
    const mockPush = vi.fn()

    wrapper = mount(ParcelTracker, {
      props: { id: 'PROP123' },
      global: {
        plugins: [router],
        mocks: {
          $router: { push: mockPush },
          $route: { params: { id: 'PROP123' } }
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.initialTrackingNumber).toBe('PROP123')
    expect(wrapper.findComponent(TrackingInput).props('initialTrackingNumber')).toBe('PROP123')
  })

  it('handles route parameter changes', async () => {
    // Mock $route and $router
    wrapper.vm.$route = { params: { id: 'ROUTE123' } }
    wrapper.vm.$router = { push: vi.fn() }

    await wrapper.vm.$options.watch['$route.params.id'].handler.call(wrapper.vm, 'ROUTE123')

    expect(wrapper.vm.initialTrackingNumber).toBe('ROUTE123')
    expect(wrapper.vm.trackingData).toBeTruthy()
    expect(wrapper.vm.trackingData.trackingNumber).toBe('ROUTE123')
  })

  it('clears data when route parameter becomes empty', async () => {
    // Mock router to avoid navigation errors
    const mockPush = vi.fn()
    wrapper.vm.$router = { push: mockPush }
    wrapper.vm.$route = { params: { id: null } }

    // First set some data by directly setting the tracking data
    wrapper.vm.trackingData = wrapper.vm.getMockTrackingData('TEST123')
    wrapper.vm.initialTrackingNumber = 'TEST123'

    expect(wrapper.vm.trackingData).toBeTruthy()
    expect(wrapper.vm.initialTrackingNumber).toBe('TEST123')

    // Then clear it by simulating route parameter change
    await wrapper.vm.$options.watch['$route.params.id'].handler.call(wrapper.vm, null)

    expect(wrapper.vm.initialTrackingNumber).toBe('')
    expect(wrapper.vm.trackingData).toBeNull()
  })

  it('updates URL when tracking a parcel', async () => {
    const mockPush = vi.fn()
    wrapper.vm.$router = { push: mockPush }
    wrapper.vm.$route = { params: { id: null } }

    await wrapper.vm.handleTrackParcel('URL123')

    expect(mockPush).toHaveBeenCalledWith({
      name: 'track',
      params: { id: 'URL123' }
    })
  })

  it('does not update URL if already on correct route', async () => {
    const mockPush = vi.fn()
    wrapper.vm.$router = { push: mockPush }
    wrapper.vm.$route = { params: { id: 'SAME123' } }

    await wrapper.vm.handleTrackParcel('SAME123')

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('handles trackParcel event from TrackingInput', async () => {
    // Mock router to avoid navigation errors
    const mockPush = vi.fn()
    wrapper.vm.$router = { push: mockPush }
    wrapper.vm.$route = { params: { id: null } }

    const trackingInput = wrapper.findComponent(TrackingInput)

    // Simulate the event emission
    await trackingInput.vm.$emit('track-parcel', 'EVENT123')

    // The parent should handle the event and update trackingData
    expect(wrapper.vm.trackingData?.trackingNumber).toBe('EVENT123')
  })

  it('watches id prop changes', async () => {
    // Mock router to avoid navigation errors
    const mockPush = vi.fn()

    wrapper = mount(ParcelTracker, {
      props: { id: 'INITIAL123' },
      global: {
        plugins: [router],
        mocks: {
          $router: { push: mockPush },
          $route: { params: { id: 'INITIAL123' } }
        }
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.initialTrackingNumber).toBe('INITIAL123')

    await wrapper.setProps({ id: 'UPDATED123' })
    expect(wrapper.vm.initialTrackingNumber).toBe('UPDATED123')
    expect(wrapper.vm.trackingData.trackingNumber).toBe('UPDATED123')
  })

  it('has correct component structure', () => {
    expect(wrapper.find('.max-w-4xl').exists()).toBe(true)
    expect(wrapper.find('.bg-white.dark\\:bg-gray-800').exists()).toBe(true)
    expect(wrapper.find('.rounded-lg.shadow-lg').exists()).toBe(true)
  })

  it('passes correct props to ParcelTimeline when tracking data exists', async () => {
    // Mock router to avoid navigation errors
    const mockPush = vi.fn()
    wrapper.vm.$router = { push: mockPush }
    wrapper.vm.$route = { params: { id: null } }

    await wrapper.vm.handleTrackParcel('TIMELINE123')
    await wrapper.vm.$nextTick()

    const parcelTimeline = wrapper.findComponent(ParcelTimeline)
    expect(parcelTimeline.exists()).toBe(true)
    expect(parcelTimeline.props('trackingData')).toEqual(wrapper.vm.trackingData)
  })
})
