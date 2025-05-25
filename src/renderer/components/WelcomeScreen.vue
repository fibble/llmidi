<template>
  <div class="welcome-screen">
    <div class="welcome-content">
      <div class="logo-section">
        <img 
          src="/images/new-transparent-cropped.png" 
          alt="LLMIDI Logo" 
          class="logo"
        >
      </div>
      
      <h1 class="welcome-title">
        Welcome to LLMIDI
      </h1>
      <p class="welcome-subtitle">
        Create music through conversation with AI<br>
      </p>
      <p />
      <div v-if="!hasApiKey" class="setup-section">
        <p class="setup-message">
          To get started please configure an OpenRouter API Key.
        </p>
        <button class="btn btn-primary btn-lg" @click="$emit('open-settings')">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
          </svg>
          Configure LLMIDI
        </button>
      </div>
      
      <div v-else class="action-buttons">
        <button class="btn btn-primary btn-lg" @click="showNewCompositionModal = true">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          New Composition
        </button>
        
        <button class="btn btn-secondary btn-lg" @click="handleLoadComposition">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
          </svg>
          Load Composition
        </button>
      </div>
      
      <div class="features">
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
          </svg>
          <h3>Natural Language</h3>
          <p>Describe the music you want to create in plain English</p>
        </div>
        
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
          </svg>
          <h3>Multi-Track</h3>
          <p>Layer multiple instruments to build complete arrangements</p>
        </div>
        
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
          <h3>Piano Roll</h3>
          <p>See and edit your compositions with an intuitive interface</p>
        </div>
        
        <div class="feature">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3v2H7V3h2m2 0h2v2h-2V3m4 0h2v2h-2V3M3 7h2v2H3V7m4 0h2v2H7V7m4 0h2v2h-2V7m4 0h2v2h-2V7m4 0h2v2h-2V7M3 11h2v2H3v-2m4 0h2v2H7v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2M3 15h2v2H3v-2m4 0h2v2H7v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2M3 19h2v2H3v-2m4 0h2v2H7v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2" />
          </svg>
          <h3>DAW Integration</h3>
          <p>Export MIDI or connect directly to your favorite DAW</p>
        </div>
      </div>
    </div>
    
    <NewCompositionModal
      :is-open="showNewCompositionModal"
      @close="showNewCompositionModal = false"
      @create="handleCreateComposition"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useSettingsStore } from '../stores/settingsStore'
import NewCompositionModal from './NewCompositionModal.vue'

const emit = defineEmits(['open-settings'])

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const showNewCompositionModal = ref(false)

// Check if API key is configured
const hasApiKey = computed(() => settingsStore.hasValidApiKey())

function handleCreateComposition(data) {
  if (!settingsStore.hasValidApiKey()) {
    emit('open-settings')
    showNewCompositionModal.value = false
    return
  }
  
  // Create the composition
  appStore.createComposition(data.compositionName)
  
  // Create the first track
  appStore.addTrack({
    name: data.trackName
  })
  
  // Close the modal
  showNewCompositionModal.value = false
}

function handleLoadComposition() {
  if (!settingsStore.hasValidApiKey()) {
    emit('open-settings')
    return
  }
  
  // TODO: Implement load functionality
  alert('Load composition functionality coming soon!')
}
</script>

<style scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--spacing-xl);
}

.welcome-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.logo-section {
  margin-bottom: var(--spacing-xl);
}

.logo {
  width: auto;
  height: 120px;
}

.welcome-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.welcome-subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3xl);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.feature {
  text-align: center;
  padding: var(--spacing-lg);
}

.feature-icon {
  width: 48px;
  height: 48px;
  color: #ffffff;
  margin-bottom: var(--spacing-md);
  opacity: 0.9;
}

.feature h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.feature p {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 200px;
  justify-content: center;
}

.action-buttons .icon {
  width: 20px;
  height: 20px;
}

.setup-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.setup-message {
  max-width: 500px;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.setup-section .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 200px;
  justify-content: center;
}

.setup-section .icon {
  width: 20px;
  height: 20px;
}
</style>
