<template>
  <div class="app">
    <HeaderBar @open-settings="showSettings = true" />
    <main class="app-main">
      <div class="app-content">
        <WelcomeScreen 
          v-if="!appStore.hasComposition" 
          @open-settings="showSettings = true"
        />
        <div v-else class="workspace">
          <aside class="sidebar">
            <TrackList />
          </aside>
          <section class="track-area">
            <div v-if="!appStore.activeTrackId" class="track-placeholder">
              <p>Select a track to start composing</p>
            </div>
            <div v-else class="track-content">
              <h2>{{ appStore.activeTrack?.name }}</h2>
              <p class="track-info">Ready to generate MIDI content</p>
            </div>
          </section>
        </div>
      </div>
    </main>
    <TransportControls v-if="appStore.hasComposition" />
    
    <!-- Settings Modal -->
    <SettingsModal 
      :is-open="showSettings"
      @close="showSettings = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from './stores/appStore'
import HeaderBar from './components/HeaderBar.vue'
import WelcomeScreen from './components/WelcomeScreen.vue'
import TrackList from './components/TrackList.vue'
import TransportControls from './components/TransportControls.vue'
import SettingsModal from './components/SettingsModal.vue'

const appStore = useAppStore()
const showSettings = ref(false)
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  background-color: var(--bg-secondary);
}

.track-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.track-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font-size: var(--font-size-lg);
}

.track-content {
  flex: 1;
  padding: var(--spacing-xl);
}

.track-content h2 {
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.track-info {
  color: var(--text-secondary);
}
</style>
