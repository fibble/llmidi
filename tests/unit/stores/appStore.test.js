import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/appStore'

describe('appStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('track management', () => {
    it('should start with empty tracks', () => {
      const store = useAppStore()
      expect(store.tracks).toHaveLength(0)
      expect(store.trackCount).toBe(0)
    })

    it('should add a new track with default values', () => {
      const store = useAppStore()
      const track = store.addTrack()
      
      expect(store.tracks).toHaveLength(1)
      expect(track.name).toBe('Track 1')
      expect(track.instrument).toBe('piano')
      expect(track.midiData).toEqual([])
      expect(track.volume).toBe(0.8)
      expect(track.isMuted).toBe(false)
      expect(track.isSolo).toBe(false)
    })

    it('should add track with custom values', () => {
      const store = useAppStore()
      const customData = {
        name: 'Bass Track',
        instrument: 'bass',
        volume: 0.6
      }
      const track = store.addTrack(customData)
      
      expect(track.name).toBe('Bass Track')
      expect(track.instrument).toBe('bass')
      expect(track.volume).toBe(0.6)
    })

    it('should set first track as active', () => {
      const store = useAppStore()
      const track = store.addTrack()
      
      expect(store.activeTrackId).toBe(track.id)
      expect(store.activeTrack).toStrictEqual(track)
    })

    it('should remove track and update active track', () => {
      const store = useAppStore()
      const track1 = store.addTrack({ name: 'Track 1' })
      const track2 = store.addTrack({ name: 'Track 2' })
      
      store.setActiveTrack(track2.id)
      store.removeTrack(track2.id)
      
      expect(store.tracks).toHaveLength(1)
      expect(store.activeTrackId).toBe(track1.id)
    })

    it('should update track properties', () => {
      const store = useAppStore()
      const track = store.addTrack()
      
      store.updateTrack(track.id, {
        name: 'Updated Track',
        isMuted: true,
        volume: 0.5
      })
      
      expect(track.name).toBe('Updated Track')
      expect(track.isMuted).toBe(true)
      expect(track.volume).toBe(0.5)
    })
  })

  describe('playback control', () => {
    it('should toggle playback state', () => {
      const store = useAppStore()
      
      expect(store.isPlaying).toBe(false)
      store.togglePlayback()
      expect(store.isPlaying).toBe(true)
      store.togglePlayback()
      expect(store.isPlaying).toBe(false)
    })

    it('should stop playback and reset time', () => {
      const store = useAppStore()
      store.isPlaying = true
      store.currentTime = 100
      
      store.stopPlayback()
      
      expect(store.isPlaying).toBe(false)
      expect(store.currentTime).toBe(0)
    })

    it('should update playback time', () => {
      const store = useAppStore()
      
      store.updatePlaybackTime(250)
      expect(store.currentTime).toBe(250)
    })
  })

  describe('tempo and time signature', () => {
    it('should set tempo within valid range', () => {
      const store = useAppStore()
      
      store.setTempo(140)
      expect(store.tempo).toBe(140)
      
      // Test boundaries
      store.setTempo(30)
      expect(store.tempo).toBe(40) // Minimum
      
      store.setTempo(350)
      expect(store.tempo).toBe(300) // Maximum
    })

    it('should set time signature', () => {
      const store = useAppStore()
      
      store.setTimeSignature(3, 4)
      expect(store.timeSignature).toEqual({ numerator: 3, denominator: 4 })
    })
  })
})
