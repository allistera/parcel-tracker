import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TrackingInput from '../TrackingInput.vue'

describe('TrackingInput', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(TrackingInput)
  })

  it('renders correctly', () => {
    expect(wrapper.find('label').text()).toBe('Enter Tracking Number')
    expect(wrapper.find('input').attributes('placeholder')).toBe('e.g., 1Z999AA1234567890')
    expect(wrapper.find('button').text()).toBe('Track Package')
  })

  it('displays initial tracking number when prop is provided', async () => {
    wrapper = mount(TrackingInput, {
      props: {
        initialTrackingNumber: 'TEST123'
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.value).toBe('TEST123')
  })

  it('clears input when initialTrackingNumber becomes empty', async () => {
    wrapper = mount(TrackingInput, {
      props: {
        initialTrackingNumber: 'TEST123'
      }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('input').element.value).toBe('TEST123')

    await wrapper.setProps({ initialTrackingNumber: '' })
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('updates tracking number when user types', async () => {
    const input = wrapper.find('input')
    await input.setValue('ABC123')
    
    expect(wrapper.vm.trackingNumber).toBe('ABC123')
    expect(input.element.value).toBe('ABC123')
  })

  it('disables submit button when input is empty', async () => {
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    const input = wrapper.find('input')
    await input.setValue('ABC123')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('shows loading state when form is submitted', async () => {
    const input = wrapper.find('input')
    await input.setValue('ABC123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.vm.loading).toBe(true)
    expect(wrapper.find('button').text()).toBe('Tracking...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits track-parcel event with tracking number on submit', async () => {
    const input = wrapper.find('input')
    await input.setValue('ABC123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(wrapper.emitted('track-parcel')).toBeTruthy()
    expect(wrapper.emitted('track-parcel')[0]).toEqual(['ABC123'])
  })

  it('trims whitespace from tracking number on submit', async () => {
    const input = wrapper.find('input')
    await input.setValue('  ABC123  ')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Wait for the async operation to complete
    await new Promise(resolve => setTimeout(resolve, 1100))

    expect(wrapper.emitted('track-parcel')[0]).toEqual(['ABC123'])
  })

  it('does not submit when tracking number is empty or whitespace only', async () => {
    const input = wrapper.find('input')
    await input.setValue('   ')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.emitted('track-parcel')).toBeFalsy()
  })

  it('shows error message when error occurs', async () => {
    // Mock console.error to avoid error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Override the submitTracking method to throw an error
    wrapper.vm.submitTracking = vi.fn().mockImplementation(async () => {
      wrapper.vm.loading = true
      wrapper.vm.error = null
      try {
        throw new Error('Network error')
      } catch (err) {
        wrapper.vm.error = 'Failed to track package. Please try again.'
      } finally {
        wrapper.vm.loading = false
      }
    })

    const input = wrapper.find('input')
    await input.setValue('ABC123')

    await wrapper.vm.submitTracking()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.error).toBe('Failed to track package. Please try again.')
    expect(wrapper.find('.text-red-800').text()).toBe('Failed to track package. Please try again.')
    
    consoleSpy.mockRestore()
  })

  it('has correct input attributes', () => {
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('required')).toBeDefined()
    expect(input.attributes('id')).toBe('tracking-number')
  })
})