<template>
  <div class="track-list">
    <div class="track-list-header">
      <h2>Tracks</h2>
      <button class="btn btn-primary btn-sm" @click="addNewTrack">
        <svg class="icon icon-sm" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Add Track
      </button>
    </div>
    
    <div class="tracks">
      <div 
        v-for="track in appStore.tracks" 
        :key="track.id"
        class="track-item"
        :class="{ active: track.id === appStore.activeTrackId }"
        @click="appStore.setActiveTrack(track.id)"
      >
        <div class="track-header">
          <div class="track-info">
            <h3 class="track-name">
              {{ track.name }}
            </h3>
            <span class="track-instrument">{{ track.instrument }}</span>
          </div>
          
          <div class="track-controls">
            <button 
              class="btn btn-ghost btn-icon btn-sm"
              :class="{ active: track.isMuted }"
              title="Mute"
              @click.stop="toggleMute(track.id)"
            >
              <svg class="icon icon-sm" viewBox="0 0 24 24">
                <path v-if="!track.isMuted" d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3z" />
                <path v-else d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.26c-.67.51-1.42.93-2.25 1.17v2.07c1.38-.32 2.63-.95 3.68-1.81L19.73 21L21 19.73l-9-9M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.916 8.916 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-2.5 0L14 9.97V8c1.5.71 2.5 2.24 2.5 4c0 .64-.09 1.26-.25 1.84L16.5 12z" />
              </svg>
            </button>
            
            <button 
              class="btn btn-ghost btn-icon btn-sm"
              :class="{ active: track.isSolo }"
              title="Solo"
              @click.stop="toggleSolo(track.id)"
            >
              <svg class="icon icon-sm" viewBox="0 0 24 24">
                <path d="M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" />
              </svg>
            </button>
            
            <button 
              class="btn btn-ghost btn-icon btn-sm"
              title="Remove Track"
              @click.stop="removeTrack(track.id)"
            >
              <svg class="icon icon-sm" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="track-content">
          <div v-if="track.midiData.length === 0" class="track-empty">
            <span>No MIDI data yet. Start a conversation to generate music!</span>
          </div>
          <div v-else class="track-preview">
            <span>{{ track.midiData.length }} notes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

function addNewTrack() {
  appStore.addTrack()
}

function toggleMute(trackId) {
  const track = appStore.tracks.find(t => t.id === trackId)
  if (track) {
    appStore.updateTrack(trackId, { isMuted: !track.isMuted })
  }
}

function toggleSolo(trackId) {
  const track = appStore.tracks.find(t => t.id === trackId)
  if (track) {
    appStore.updateTrack(trackId, { isSolo: !track.isSolo })
  }
}

function removeTrack(trackId) {
  if (confirm('Are you sure you want to remove this track?')) {
    appStore.removeTrack(trackId)
  }
}
</script>

<style scoped>
.track-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-lg);
}

.track-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.track-list-header h2 {
  margin: 0;
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
}

.track-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.track-item:hover {
  border-color: var(--border-light);
}

.track-item.active {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 1px var(--accent-primary);
}

.track-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.track-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.track-name {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: 600;
}

.track-instrument {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: capitalize;
}

.track-controls {
  display: flex;
  gap: var(--spacing-xs);
}

.track-controls .btn.active {
  color: var(--accent-primary);
  background-color: var(--bg-tertiary);
}

.track-content {
  min-height: 60px;
  display: flex;
  align-items: center;
}

.track-empty {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  font-style: italic;
}

.track-preview {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
