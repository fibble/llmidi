import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '@/stores/settingsStore'

// Mock window.electronAPI
vi.mock('@/stores/settingsStore', async () => {
  const actual = await vi.importActual('@/stores/settingsStore')
  
  // Override window.electronAPI in the module
  if (typeof window !== 'undefined') {
    window.electronAPI = {
      getSettings: vi.fn().mockResolvedValue(undefined),
      setSettings: vi.fn().mockResolvedValue(true)
    }
  }
  
  return actual
})

describe('settingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should have default settings', () => {
      const store = useSettingsStore()
      
      expect(store.settings.openRouterApiKey).toBe('')
      expect(store.settings.defaultModel).toBe('openai/gpt-4')
      expect(store.settings.theme).toBe('dark')
      expect(store.settings.generation.defaultBars).toBe(8)
      expect(store.settings.ui.pianoRollZoom).toBe(1)
    })
  })

  describe('API key validation', () => {
    it('should return false when no API key is set', () => {
      const store = useSettingsStore()
      expect(store.settings.openRouterApiKey).toBe('')
      expect(store.hasValidApiKey()).toBe(false)
    })

    it('should return true when API key is set', async () => {
      const store = useSettingsStore()
      await store.setSetting('openRouterApiKey', 'test-api-key')
      expect(store.hasValidApiKey()).toBe(true)
    })
  })

  describe('settings management', () => {
    it('should update a setting', async () => {
      const store = useSettingsStore()
      await store.setSetting('theme', 'light')
      
      expect(store.settings.theme).toBe('light')
      expect(window.electronAPI.setSettings).toHaveBeenCalledWith('theme', 'light')
    })

    it('should update nested settings', async () => {
      const store = useSettingsStore()
      await store.updateNestedSetting('generation', 'defaultBars', 16)
      
      expect(store.settings.generation.defaultBars).toBe(16)
      expect(window.electronAPI.setSettings).toHaveBeenCalledWith(
        'generation',
        expect.objectContaining({ defaultBars: 16 })
      )
    })

    it('should reset settings to defaults', async () => {
      const store = useSettingsStore()
      
      // Change some settings using the store methods
      await store.setSetting('theme', 'light')
      await store.updateNestedSetting('generation', 'defaultBars', 16)
      
      // Verify changes
      expect(store.settings.theme).toBe('light')
      expect(store.settings.generation.defaultBars).toBe(16)
      
      // Reset
      await store.resetSettings()
      
      expect(store.settings.theme).toBe('dark')
      expect(store.settings.generation.defaultBars).toBe(8)
      
      // Check that all defaults were saved
      expect(window.electronAPI.setSettings).toHaveBeenCalledWith('theme', 'dark')
      expect(window.electronAPI.setSettings).toHaveBeenCalledWith(
        'generation',
        expect.objectContaining({ defaultBars: 8 })
      )
    })
  })

  describe('loading settings', () => {
    it('should load settings from electron store', async () => {
      // Mock electron store to return custom values
      window.electronAPI.getSettings.mockImplementation((key) => {
        const mockData = {
          openRouterApiKey: 'stored-api-key',
          theme: 'light'
        }
        return mockData[key]
      })

      const store = useSettingsStore()
      await store.loadSettings()
      
      expect(store.settings.openRouterApiKey).toBe('stored-api-key')
      expect(store.settings.theme).toBe('light')
      expect(store.isLoading).toBe(false)
    })

    it('should handle loading errors gracefully', async () => {
      window.electronAPI.getSettings.mockRejectedValue(new Error('Load failed'))
      
      const store = useSettingsStore()
      await store.loadSettings()
      
      // Should still have defaults
      expect(store.settings.theme).toBe('dark')
      expect(store.isLoading).toBe(false)
    })
  })
})
