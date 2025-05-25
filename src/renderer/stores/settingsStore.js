import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Default settings
  const defaultSettings = {
    openRouterApiKey: '',
    defaultModel: 'openai/gpt-4',
    theme: 'dark',
    audioDevice: 'default',
    midiDevice: 'none',
    defaultInstruments: {
      melody: 'piano',
      bass: 'bass',
      chords: 'electric-piano',
      drums: 'drums'
    },
    generation: {
      defaultBars: 8,
      defaultKey: 'C',
      includeChordSymbols: true,
      humanizeVelocity: true,
      humanizeTiming: true
    },
    ui: {
      pianoRollZoom: 1,
      showVelocity: true,
      snapToGrid: true,
      gridSubdivision: 16
    }
  }

  // State
  const settings = ref(JSON.parse(JSON.stringify(defaultSettings)))
  const isLoading = ref(true)

  // Load settings from electron store
  async function loadSettings() {
    try {
      isLoading.value = true
      
      // Load each setting from electron store
      for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        const value = await window.electronAPI.getSettings(key)
        if (value !== undefined) {
          settings.value[key] = value
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Save a specific setting
  async function setSetting(key, value) {
    settings.value[key] = value
    
    try {
      await window.electronAPI.setSettings(key, value)
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error)
    }
  }

  // Update nested settings
  async function updateNestedSetting(category, key, value) {
    if (!settings.value[category]) {
      settings.value[category] = {}
    }
    
    settings.value[category][key] = value
    
    try {
      await window.electronAPI.setSettings(category, settings.value[category])
    } catch (error) {
      console.error(`Failed to save nested setting ${category}.${key}:`, error)
    }
  }

  // Reset settings to defaults
  async function resetSettings() {
    // Deep clone to ensure nested objects are reset
    settings.value = JSON.parse(JSON.stringify(defaultSettings))
    
    // Save all default settings
    for (const [key, value] of Object.entries(defaultSettings)) {
      try {
        await window.electronAPI.setSettings(key, value)
      } catch (error) {
        console.error(`Failed to reset setting ${key}:`, error)
      }
    }
  }

  // Validate API key
  function hasValidApiKey() {
    return !!(settings.value.openRouterApiKey && settings.value.openRouterApiKey.length > 0)
  }

  // Initialize on store creation
  loadSettings()

  return {
    // State
    settings,
    isLoading,
    
    // Actions
    loadSettings,
    setSetting,
    updateNestedSetting,
    resetSettings,
    hasValidApiKey
  }
})
