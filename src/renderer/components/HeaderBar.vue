<template>
  <header class="header-bar">
    <div class="header-left">
      <h1 class="app-title">llmidi</h1>
      <span class="app-version">v{{ version }}</span>
    </div>
    
    <div class="header-center">
      <TransportControls />
    </div>
    
    <div class="header-right">
      <button class="btn btn-ghost btn-icon" @click="openSettings" title="Settings">
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
        </svg>
      </button>
      
      <div class="window-controls" v-if="!isMac">
        <button class="btn btn-ghost btn-icon" @click="minimizeWindow" title="Minimize">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M20 14H4v-2h16v2Z"/>
          </svg>
        </button>
        <button class="btn btn-ghost btn-icon" @click="maximizeWindow" title="Maximize">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4m2 2v12h12V6H6Z"/>
          </svg>
        </button>
        <button class="btn btn-ghost btn-icon window-close" @click="closeWindow" title="Close">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TransportControls from './TransportControls.vue'

const emit = defineEmits(['open-settings'])

const version = ref('0.1.0')
const isMac = ref(false)

onMounted(async () => {
  version.value = await window.electronAPI.getVersion()
  const platform = await window.electronAPI.getPlatform()
  isMac.value = platform === 'darwin'
})

function openSettings() {
  emit('open-settings')
}

function minimizeWindow() {
  window.electronAPI.minimizeWindow()
}

function maximizeWindow() {
  window.electronAPI.maximizeWindow()
}

function closeWindow() {
  window.electronAPI.closeWindow()
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--spacing-md);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  -webkit-app-region: drag;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  -webkit-app-region: no-drag;
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 0 0 auto;
}

.header-right {
  flex: 1;
  justify-content: flex-end;
}

.app-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin: 0;
}

.app-version {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.window-controls {
  display: flex;
  gap: var(--spacing-xs);
  margin-left: var(--spacing-md);
}

.window-close:hover {
  background-color: #e81123;
  color: white;
}
</style>
