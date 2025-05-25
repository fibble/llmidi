<template>
  <div class="transport-controls">
    <button 
      class="btn btn-ghost btn-icon"
      @click="appStore.stopPlayback()"
      title="Stop"
    >
      <svg class="icon" viewBox="0 0 24 24">
        <path d="M6 6h12v12H6z"/>
      </svg>
    </button>
    
    <button 
      class="btn btn-primary btn-icon"
      @click="appStore.togglePlayback()"
      :title="appStore.isPlaying ? 'Pause' : 'Play'"
    >
      <svg v-if="!appStore.isPlaying" class="icon" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg v-else class="icon" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
    </button>
    
    <div class="tempo-control">
      <label class="tempo-label">{{ appStore.tempo }} BPM</label>
      <input
        type="range"
        class="tempo-slider"
        :value="appStore.tempo"
        @input="appStore.setTempo($event.target.value)"
        min="40"
        max="300"
        step="1"
      />
    </div>
    
    <div class="time-signature">
      <span class="time-sig-value">{{ appStore.timeSignature.numerator }}/{{ appStore.timeSignature.denominator }}</span>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
</script>

<style scoped>
.transport-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.tempo-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: var(--spacing-md);
}

.tempo-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  min-width: 60px;
}

.tempo-slider {
  width: 100px;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.tempo-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
}

.tempo-slider::-webkit-slider-thumb:hover {
  background: var(--accent-hover);
}

.time-signature {
  margin-left: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.time-sig-value {
  font-family: var(--font-mono);
}
</style>
