import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ParcelTimeline from '../ParcelTimeline.vue'

const mockTrackingData = {
  trackingNumber: 'TEST123456',
  currentStatus: 'Out for Delivery',
  estimatedDelivery: '2024-01-18',
  timeline: [
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
}

describe('ParcelTimeline', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ParcelTimeline, {
      props: {
        trackingData: mockTrackingData
      }
    })
  })

  it('renders correctly with tracking data', () => {
    expect(wrapper.find('h2').text()).toContain('Tracking Number: TEST123456')
    expect(wrapper.text()).toContain('Out for Delivery')
    expect(wrapper.text()).toContain('Estimated Delivery: January 18, 2024')
  })

  it('displays all timeline items', () => {
    const timelineItems = wrapper.findAll('.mb-8.relative')
    expect(timelineItems).toHaveLength(4)

    // Check that all status names are displayed
    expect(wrapper.text()).toContain('Order Placed')
    expect(wrapper.text()).toContain('Package Prepared')
    expect(wrapper.text()).toContain('In Transit')
    expect(wrapper.text()).toContain('Out for Delivery')
  })

  it('displays timeline item details correctly', () => {
    const firstItem = mockTrackingData.timeline[0]
    
    expect(wrapper.text()).toContain(firstItem.status)
    expect(wrapper.text()).toContain(firstItem.description)
    expect(wrapper.text()).toContain(firstItem.location)
    expect(wrapper.text()).toContain(firstItem.time)
  })

  it('formats dates correctly', () => {
    expect(wrapper.text()).toContain('January 15, 2024')
    expect(wrapper.text()).toContain('January 16, 2024')
    expect(wrapper.text()).toContain('January 17, 2024')
    expect(wrapper.text()).toContain('January 18, 2024')
  })

  it('displays current status badge', () => {
    const statusBadge = wrapper.find('.bg-blue-100')
    expect(statusBadge.text()).toBe('Out for Delivery')
  })

  it('shows different icon for last timeline item', () => {
    const timelineItems = wrapper.findAll('.mb-8.relative')
    const lastItem = timelineItems[timelineItems.length - 1]
    const firstItem = timelineItems[0]

    // Last item should have green background (completed)
    expect(lastItem.find('.bg-green-500').exists()).toBe(true)
    // First items should have blue background (in progress)
    expect(firstItem.find('.bg-blue-500').exists()).toBe(true)
  })

  it('displays location icons', () => {
    const locationIcons = wrapper.findAll('svg').filter(svg => 
      svg.find('path[fill-rule="evenodd"]').exists() && 
      svg.find('path').attributes('d')?.includes('4.95-4.95')
    )
    expect(locationIcons.length).toBeGreaterThan(0)
  })

  it('shows timeline connector lines', () => {
    const connectorLines = wrapper.findAll('.w-0\\.5.h-16.bg-gray-300')
    // Should have 3 connector lines (between 4 items)
    expect(connectorLines).toHaveLength(3)
  })

  it('displays all required information for each timeline item', () => {
    mockTrackingData.timeline.forEach(item => {
      expect(wrapper.text()).toContain(item.status)
      expect(wrapper.text()).toContain(item.description)
      expect(wrapper.text()).toContain(item.location)
      expect(wrapper.text()).toContain(item.time)
    })
  })

  it('handles single timeline item correctly', async () => {
    const singleItemData = {
      trackingNumber: 'SINGLE123',
      currentStatus: 'Order Placed',
      estimatedDelivery: '2024-01-20',
      timeline: [{
        status: 'Order Placed',
        date: '2024-01-19',
        time: '10:00 AM',
        description: 'Order received',
        location: 'Online'
      }]
    }

    await wrapper.setProps({ trackingData: singleItemData })

    expect(wrapper.find('h2').text()).toContain('SINGLE123')
    expect(wrapper.findAll('.mb-8.relative')).toHaveLength(1)
    expect(wrapper.findAll('.w-0\\.5.h-16.bg-gray-300')).toHaveLength(0) // No connector lines
  })
})