import { vi } from 'vitest'

// Mock window.Event constructor for happy-dom
class MockEvent {
  constructor(type, options) {
    this.type = type
    this.bubbles = options?.bubbles || false
    this.cancelable = options?.cancelable || false
    this.composed = options?.composed || false
  }
}

// Mock window.electronAPI globally
global.window = {
  Event: MockEvent,
  electronAPI: {
    getVersion: vi.fn().mockResolvedValue('0.1.0'),
    getPlatform: vi.fn().mockResolvedValue('darwin'),
    minimizeWindow: vi.fn(),
    maximizeWindow: vi.fn(),
    closeWindow: vi.fn(),
    getSettings: vi.fn().mockResolvedValue(undefined),
    setSettings: vi.fn().mockResolvedValue(true)
  },
  electronConstants: {
    platform: 'darwin',
    isDevelopment: true
  }
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
}
