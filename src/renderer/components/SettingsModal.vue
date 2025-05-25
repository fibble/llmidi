<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container settings-modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          Settings
        </h2>
        <button class="btn btn-ghost btn-icon" @click="$emit('close')">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
          </svg>
        </button>
      </div>
      
      <div class="settings-content">
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- API Configuration Tab -->
          <div v-if="activeTab === 'api'" class="tab-panel">
            <div class="setting-group">
              <h3>OpenRouter Configuration</h3>
              <p class="setting-description">
                Configure your OpenRouter API key to enable AI-powered music generation.
                Get your API key from <a href="https://openrouter.ai/keys" target="_blank" class="link">openrouter.ai/keys</a>
              </p>
              
              <div class="form-group">
                <label for="api-key">API Key</label>
                <div class="input-with-button">
                  <input
                    id="api-key"
                    v-model="localSettings.openRouterApiKey"
                    :type="showApiKey ? 'text' : 'password'"
                    class="input"
                    placeholder="sk-or-..."
                    @input="markDirty"
                  >
                  <button 
                    class="btn btn-ghost btn-sm"
                    type="button"
                    @click="showApiKey = !showApiKey"
                  >
                    {{ showApiKey ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="model-select">AI Model</label>
                <select 
                  id="model-select"
                  v-model="modelSelection"
                  class="input"
                  @change="handleModelChange"
                >
                  <option value="custom">
                    Custom Model
                  </option>
                  <optgroup label="OpenAI">
                    <option value="openai/gpt-4">
                      GPT-4
                    </option>
                    <option value="openai/gpt-4-turbo">
                      GPT-4 Turbo
                    </option>
                    <option value="openai/gpt-3.5-turbo">
                      GPT-3.5 Turbo
                    </option>
                  </optgroup>
                  <optgroup label="Anthropic">
                    <option value="anthropic/claude-3-opus">
                      Claude 3 Opus
                    </option>
                    <option value="anthropic/claude-3-sonnet">
                      Claude 3 Sonnet
                    </option>
                    <option value="anthropic/claude-3-haiku">
                      Claude 3 Haiku
                    </option>
                  </optgroup>
                  <optgroup label="Google">
                    <option value="google/gemini-pro">
                      Gemini Pro
                    </option>
                    <option value="google/gemini-pro-1.5">
                      Gemini Pro 1.5
                    </option>
                  </optgroup>
                </select>
              </div>
              
              <div v-if="modelSelection === 'custom'" class="form-group">
                <label for="custom-model">Custom Model Name</label>
                <input
                  id="custom-model"
                  v-model="localSettings.defaultModel"
                  type="text"
                  class="input"
                  placeholder="e.g., meta-llama/llama-2-70b-chat"
                  @input="markDirty"
                >
                <p class="help-text">
                  Enter the exact model identifier from OpenRouter
                </p>
              </div>
              
              <button 
                class="btn btn-secondary"
                :disabled="!localSettings.openRouterApiKey || isTestingConnection"
                @click="testConnection"
              >
                {{ isTestingConnection ? 'Testing...' : 'Test Connection' }}
              </button>
              
              <div v-if="connectionTestResult" class="alert" :class="connectionTestResult.type">
                {{ connectionTestResult.message }}
              </div>
            </div>
          </div>
          
          <!-- Audio & MIDI Tab -->
          <div v-if="activeTab === 'audio'" class="tab-panel">
            <div class="setting-group">
              <h3>Audio Settings</h3>
              
              <div class="form-group">
                <label for="audio-device">Audio Output Device</label>
                <select 
                  id="audio-device"
                  v-model="localSettings.audioDevice"
                  class="input"
                  @change="markDirty"
                >
                  <option value="default">
                    System Default
                  </option>
                  <!-- Additional devices would be populated dynamically -->
                </select>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>MIDI Settings</h3>
              
              <div class="form-group">
                <label for="midi-device">MIDI Output Device</label>
                <select 
                  id="midi-device"
                  v-model="localSettings.midiDevice"
                  class="input"
                  @change="markDirty"
                >
                  <option value="none">
                    None
                  </option>
                  <option value="virtual">
                    Virtual MIDI
                  </option>
                  <!-- Additional devices would be populated dynamically -->
                </select>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>Default Instruments</h3>
              
              <div class="form-group">
                <label for="melody-instrument">Melody</label>
                <select 
                  id="melody-instrument"
                  v-model="localSettings.defaultInstruments.melody"
                  class="input"
                  @change="markDirty"
                >
                  <option value="piano">
                    Piano
                  </option>
                  <option value="electric-piano">
                    Electric Piano
                  </option>
                  <option value="synth">
                    Synthesizer
                  </option>
                  <option value="strings">
                    Strings
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="bass-instrument">Bass</label>
                <select 
                  id="bass-instrument"
                  v-model="localSettings.defaultInstruments.bass"
                  class="input"
                  @change="markDirty"
                >
                  <option value="bass">
                    Electric Bass
                  </option>
                  <option value="synth-bass">
                    Synth Bass
                  </option>
                  <option value="upright-bass">
                    Upright Bass
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="chords-instrument">Chords</label>
                <select 
                  id="chords-instrument"
                  v-model="localSettings.defaultInstruments.chords"
                  class="input"
                  @change="markDirty"
                >
                  <option value="electric-piano">
                    Electric Piano
                  </option>
                  <option value="piano">
                    Piano
                  </option>
                  <option value="guitar">
                    Guitar
                  </option>
                  <option value="organ">
                    Organ
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="drums-instrument">Drums</label>
                <select 
                  id="drums-instrument"
                  v-model="localSettings.defaultInstruments.drums"
                  class="input"
                  @change="markDirty"
                >
                  <option value="drums">
                    Acoustic Drums
                  </option>
                  <option value="electronic-drums">
                    Electronic Drums
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Generation Tab -->
          <div v-if="activeTab === 'generation'" class="tab-panel">
            <div class="setting-group">
              <h3>Generation Defaults</h3>
              
              <div class="form-group">
                <label for="default-bars">Default Length (bars)</label>
                <input
                  id="default-bars"
                  v-model.number="localSettings.generation.defaultBars"
                  type="number"
                  min="1"
                  max="64"
                  class="input"
                  @input="markDirty"
                >
              </div>
              
              <div class="form-group">
                <label for="default-key">Default Key</label>
                <select 
                  id="default-key"
                  v-model="localSettings.generation.defaultKey"
                  class="input"
                  @change="markDirty"
                >
                  <option value="C">
                    C Major
                  </option>
                  <option value="G">
                    G Major
                  </option>
                  <option value="D">
                    D Major
                  </option>
                  <option value="A">
                    A Major
                  </option>
                  <option value="E">
                    E Major
                  </option>
                  <option value="B">
                    B Major
                  </option>
                  <option value="F">
                    F Major
                  </option>
                  <option value="Bb">
                    B♭ Major
                  </option>
                  <option value="Eb">
                    E♭ Major
                  </option>
                  <option value="Ab">
                    A♭ Major
                  </option>
                  <option value="Db">
                    D♭ Major
                  </option>
                  <option value="Gb">
                    G♭ Major
                  </option>
                  <option value="Am">
                    A Minor
                  </option>
                  <option value="Em">
                    E Minor
                  </option>
                  <option value="Bm">
                    B Minor
                  </option>
                  <option value="F#m">
                    F# Minor
                  </option>
                  <option value="C#m">
                    C# Minor
                  </option>
                  <option value="G#m">
                    G# Minor
                  </option>
                  <option value="Dm">
                    D Minor
                  </option>
                  <option value="Gm">
                    G Minor
                  </option>
                  <option value="Cm">
                    C Minor
                  </option>
                  <option value="Fm">
                    F Minor
                  </option>
                  <option value="Bbm">
                    B♭ Minor
                  </option>
                  <option value="Ebm">
                    E♭ Minor
                  </option>
                </select>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input
                    v-model="localSettings.generation.includeChordSymbols"
                    type="checkbox"
                    @change="markDirty"
                  >
                  Include chord symbols
                </label>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input
                    v-model="localSettings.generation.humanizeVelocity"
                    type="checkbox"
                    @change="markDirty"
                  >
                  Humanize velocity
                </label>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input
                    v-model="localSettings.generation.humanizeTiming"
                    type="checkbox"
                    @change="markDirty"
                  >
                  Humanize timing
                </label>
              </div>
            </div>
          </div>
          
          <!-- UI Tab -->
          <div v-if="activeTab === 'ui'" class="tab-panel">
            <div class="setting-group">
              <h3>Appearance</h3>
              
              <div class="form-group">
                <label for="theme">Theme</label>
                <select 
                  id="theme"
                  v-model="localSettings.theme"
                  class="input"
                  @change="markDirty"
                >
                  <option value="dark">
                    Dark
                  </option>
                  <option value="light">
                    Light
                  </option>
                  <option value="auto">
                    Auto (System)
                  </option>
                </select>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>Piano Roll</h3>
              
              <div class="form-group">
                <label for="piano-roll-zoom">Default Zoom</label>
                <input
                  id="piano-roll-zoom"
                  v-model.number="localSettings.ui.pianoRollZoom"
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  class="input-range"
                  @input="markDirty"
                >
                <span class="range-value">{{ localSettings.ui.pianoRollZoom }}x</span>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input
                    v-model="localSettings.ui.showVelocity"
                    type="checkbox"
                    @change="markDirty"
                  >
                  Show velocity
                </label>
              </div>
              
              <div class="form-group checkbox-group">
                <label>
                  <input
                    v-model="localSettings.ui.snapToGrid"
                    type="checkbox"
                    @change="markDirty"
                  >
                  Snap to grid
                </label>
              </div>
              
              <div class="form-group">
                <label for="grid-subdivision">Grid Subdivision</label>
                <select 
                  id="grid-subdivision"
                  v-model.number="localSettings.ui.gridSubdivision"
                  class="input"
                  @change="markDirty"
                >
                  <option :value="4">
                    1/4 (Quarter notes)
                  </option>
                  <option :value="8">
                    1/8 (Eighth notes)
                  </option>
                  <option :value="16">
                    1/16 (Sixteenth notes)
                  </option>
                  <option :value="32">
                    1/32 (Thirty-second notes)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="handleReset">
          Reset to Defaults
        </button>
        <div class="footer-buttons">
          <button class="btn btn-ghost" @click="handleCancel">
            Cancel
          </button>
          <button class="btn btn-primary" :disabled="!isDirty" @click="handleSave">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const settingsStore = useSettingsStore()

// Local state
const activeTab = ref('api')
const isDirty = ref(false)
const showApiKey = ref(false)
const modelSelection = ref('custom')
const isTestingConnection = ref(false)
const connectionTestResult = ref(null)

// Deep clone settings for local editing
const localSettings = ref(JSON.parse(JSON.stringify(settingsStore.settings)))

// Tab configuration
const tabs = [
  { id: 'api', label: 'API Configuration' },
  { id: 'audio', label: 'Audio & MIDI' },
  { id: 'generation', label: 'Generation' },
  { id: 'ui', label: 'UI Preferences' }
]

// Initialize model selection
onMounted(() => {
  const currentModel = localSettings.value.defaultModel
  const predefinedModels = [
    'openai/gpt-4',
    'openai/gpt-4-turbo',
    'openai/gpt-3.5-turbo',
    'anthropic/claude-3-opus',
    'anthropic/claude-3-sonnet',
    'anthropic/claude-3-haiku',
    'google/gemini-pro',
    'google/gemini-pro-1.5'
  ]
  
  if (predefinedModels.includes(currentModel)) {
    modelSelection.value = currentModel
  } else {
    modelSelection.value = 'custom'
  }
})

// Handle model selection change
function handleModelChange() {
  if (modelSelection.value !== 'custom') {
    localSettings.value.defaultModel = modelSelection.value
    markDirty()
  }
}

// Mark settings as dirty
function markDirty() {
  isDirty.value = true
}

// Test API connection
async function testConnection() {
  isTestingConnection.value = true
  connectionTestResult.value = null
  
  try {
    // TODO: Implement actual API test
    // For now, just simulate a test
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (localSettings.value.openRouterApiKey.startsWith('sk-or-')) {
      connectionTestResult.value = {
        type: 'success',
        message: 'Connection successful! Your API key is valid.'
      }
    } else {
      connectionTestResult.value = {
        type: 'error',
        message: 'Invalid API key format. OpenRouter keys start with "sk-or-"'
      }
    }
  } catch (error) {
    connectionTestResult.value = {
      type: 'error',
      message: `Connection failed: ${error.message}`
    }
  } finally {
    isTestingConnection.value = false
  }
}

// Handle overlay click
function handleOverlayClick(event) {
  if (event.target === event.currentTarget && !isDirty.value) {
    emit('close')
  }
}

// Handle cancel
function handleCancel() {
  if (isDirty.value && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
    return
  }
  
  // Reset local settings
  localSettings.value = JSON.parse(JSON.stringify(settingsStore.settings))
  isDirty.value = false
  emit('close')
}

// Handle save
async function handleSave() {
  // Update all settings
  for (const [key, value] of Object.entries(localSettings.value)) {
    if (typeof value === 'object' && value !== null) {
      // For nested settings, update them individually
      for (const [subKey, subValue] of Object.entries(value)) {
        await settingsStore.updateNestedSetting(key, subKey, subValue)
      }
    } else {
      await settingsStore.setSetting(key, value)
    }
  }
  
  isDirty.value = false
  emit('close')
}

// Handle reset
async function handleReset() {
  if (!confirm('Are you sure you want to reset all settings to defaults?')) {
    return
  }
  
  await settingsStore.resetSettings()
  localSettings.value = JSON.parse(JSON.stringify(settingsStore.settings))
  isDirty.value = false
  
  // Reset model selection
  modelSelection.value = 'custom'
}

// Watch for prop changes
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset state when opening
    localSettings.value = JSON.parse(JSON.stringify(settingsStore.settings))
    isDirty.value = false
    connectionTestResult.value = null
    activeTab.value = 'api'
  }
})
</script>

<style scoped>
.settings-modal {
  width: 90vw;
  max-width: 800px;
  height: 90vh;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.settings-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.tabs {
  display: flex;
  flex-direction: column;
  width: 200px;
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-right: 1px solid var(--border-color);
}

.tab-button {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  font-size: var(--font-size-md);
}

.tab-button:hover {
  background-color: var(--bg-hover);
  color: var(--text-primary);
}

.tab-button.active {
  background-color: var(--primary);
  color: white;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.tab-panel {
  padding: var(--spacing-xl);
}

.setting-group {
  margin-bottom: var(--spacing-xl);
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.setting-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
}

.input-with-button {
  display: flex;
  gap: var(--spacing-sm);
}

.input-with-button .input {
  flex: 1;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.input-range {
  width: 100%;
  margin-bottom: var(--spacing-xs);
}

.range-value {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

.alert {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.alert.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.alert.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.link {
  color: var(--primary);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.footer-buttons {
  display: flex;
  gap: var(--spacing-md);
}
</style>
