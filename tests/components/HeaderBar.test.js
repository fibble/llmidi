import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HeaderBar from '@/components/HeaderBar.vue'

describe('HeaderBar', () => {
  let wrapper
  
  beforeEach(async () => {
    // Set up Pinia
    setActivePinia(createPinia())
    
    // Reset mocks
    vi.clearAllMocks()
    // Reset getPlatform to darwin (macOS) for each test
    window.electronAPI.getPlatform.mockResolvedValue('darwin')
    // Mock console.log for openSettings
    global.console.log = vi.fn()
    
    wrapper = mount(HeaderBar, {
      global: {
        stubs: {
          TransportControls: true
        }
      }
    })
    
    // Wait for async operations in onMounted
    await flushPromises()
  })

  it('renders properly', () => {
    expect(wrapper.find('.header-bar').exists()).toBe(true)
    expect(wrapper.find('.header-left').exists()).toBe(true)
    expect(wrapper.find('.header-center').exists()).toBe(true)
    expect(wrapper.find('.header-right').exists()).toBe(true)
  })

  it('displays app name and version', () => {
    expect(wrapper.find('.app-title').text()).toBe('llmidi')
    expect(wrapper.find('.app-version').text()).toBe('v0.1.0')
  })

  it('shows window controls on non-Mac platforms', async () => {
    // Mock Windows platform
    window.electronAPI.getPlatform.mockResolvedValue('win32')
    
    const winWrapper = mount(HeaderBar, {
      global: {
        stubs: {
          TransportControls: true
        }
      }
    })
    
    await flushPromises()
    expect(winWrapper.find('.window-controls').exists()).toBe(true)
  })

  it('calls window control methods when buttons clicked', async () => {
    // Mock Windows platform to show controls
    window.electronAPI.getPlatform.mockResolvedValue('win32')
    
    const winWrapper = mount(HeaderBar, {
      global: {
        stubs: {
          TransportControls: true
        }
      }
    })
    
    await flushPromises()
    
    const controls = winWrapper.find('.window-controls')
    const buttons = controls.findAll('button')
    
    // Minimize
    await buttons[0].trigger('click')
    expect(window.electronAPI.minimizeWindow).toHaveBeenCalled()
    
    // Maximize
    await buttons[1].trigger('click')
    expect(window.electronAPI.maximizeWindow).toHaveBeenCalled()
    
    // Close
    await buttons[2].trigger('click')
    expect(window.electronAPI.closeWindow).toHaveBeenCalled()
  })

  it('emits open-settings event when settings button clicked', async () => {
    const settingsBtn = wrapper.find('.header-right button')
    await settingsBtn.trigger('click')
    
    expect(wrapper.emitted('open-settings')).toBeTruthy()
    expect(wrapper.emitted('open-settings')).toHaveLength(1)
  })

  it('includes TransportControls component', () => {
    expect(wrapper.findComponent({ name: 'TransportControls' }).exists()).toBe(true)
  })

  it('hides window controls on macOS', async () => {
    // Default mock is darwin in setup.js
    // Check that no window controls are rendered for macOS
    expect(wrapper.find('.window-controls').exists()).toBe(false)
  })
})
