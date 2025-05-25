import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const compositionName = ref('')
  const compositionId = ref(null)
  const compositionCreatedAt = ref(null)
  const compositionModifiedAt = ref(null)
  const tracks = ref([])
  const activeTrackId = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const tempo = ref(120)
  const timeSignature = ref({ numerator: 4, denominator: 4 })

  // Getters
  const activeTrack = computed(() => 
    tracks.value.find(track => track.id === activeTrackId.value)
  )

  const trackCount = computed(() => tracks.value.length)

  // Actions
  function addTrack(trackData = {}) {
    const newTrack = {
      id: Date.now().toString(),
      name: trackData.name || `Track ${tracks.value.length + 1}`,
      instrument: trackData.instrument || 'piano',
      midiData: [],
      volume: 0.8,
      isMuted: false,
      isSolo: false,
      conversation: [],
      createdAt: new Date().toISOString(),
      ...trackData
    }
    
    tracks.value.push(newTrack)
    
    // Set as active if it's the first track
    if (tracks.value.length === 1) {
      activeTrackId.value = newTrack.id
    }
    
    return newTrack
  }

  function removeTrack(trackId) {
    const index = tracks.value.findIndex(track => track.id === trackId)
    if (index > -1) {
      tracks.value.splice(index, 1)
      
      // Update active track if needed
      if (activeTrackId.value === trackId) {
        activeTrackId.value = tracks.value[0]?.id || null
      }
    }
  }

  function updateTrack(trackId, updates) {
    const track = tracks.value.find(t => t.id === trackId)
    if (track) {
      Object.assign(track, updates)
    }
  }

  function setActiveTrack(trackId) {
    if (tracks.value.some(track => track.id === trackId)) {
      activeTrackId.value = trackId
    }
  }

  function togglePlayback() {
    isPlaying.value = !isPlaying.value
  }

  function stopPlayback() {
    isPlaying.value = false
    currentTime.value = 0
  }

  function updatePlaybackTime(time) {
    currentTime.value = time
  }

  function setTempo(newTempo) {
    tempo.value = Math.max(40, Math.min(300, newTempo))
  }

  function setTimeSignature(numerator, denominator) {
    timeSignature.value = { numerator, denominator }
  }

  function createComposition(name) {
    compositionName.value = name
    compositionId.value = Date.now().toString()
    compositionCreatedAt.value = new Date().toISOString()
    compositionModifiedAt.value = new Date().toISOString()
  }

  function updateCompositionModifiedTime() {
    compositionModifiedAt.value = new Date().toISOString()
  }

  const hasComposition = computed(() => !!compositionId.value)

  return {
    // State
    compositionName,
    compositionId,
    compositionCreatedAt,
    compositionModifiedAt,
    tracks,
    activeTrackId,
    isPlaying,
    currentTime,
    duration,
    tempo,
    timeSignature,
    
    // Getters
    activeTrack,
    trackCount,
    hasComposition,
    
    // Actions
    addTrack,
    removeTrack,
    updateTrack,
    setActiveTrack,
    togglePlayback,
    stopPlayback,
    updatePlaybackTime,
    setTempo,
    setTimeSignature,
    createComposition,
    updateCompositionModifiedTime
  }
})
