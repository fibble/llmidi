<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>New Composition</h2>
            <button class="btn btn-ghost btn-icon" @click="emit('close')">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
              </svg>
            </button>
          </div>
          
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="composition-name">Composition Name</label>
              <input
                id="composition-name"
                v-model="compositionName"
                type="text"
                class="form-input"
                placeholder="My New Song"
                required
                autofocus
              >
            </div>
            
            <div class="form-group">
              <label for="track-name">First Track Name</label>
              <input
                id="track-name"
                v-model="trackName"
                type="text"
                class="form-input"
                placeholder="Track 1"
                required
              >
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="emit('close')">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Create Composition
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'create'])

const compositionName = ref('')
const trackName = ref('Track 1')

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    compositionName.value = ''
    trackName.value = 'Track 1'
  }
})

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleSubmit() {
  emit('create', {
    compositionName: compositionName.value.trim(),
    trackName: trackName.value.trim() || 'Track 1'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-xl);
}

.modal-content {
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
}

.modal-body {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.form-input {
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-10px);
}
</style>
