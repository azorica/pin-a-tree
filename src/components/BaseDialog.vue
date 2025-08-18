<script setup>
/**
 * BaseDialog Component
 *
 * A reusable modal dialog component that follows WAI-ARIA dialog patterns
 * for accessibility and provides consistent behavior across the application.
 *
 * Features:
 * - Full keyboard accessibility (focus trapping, ESC to close)
 * - Screen reader support with proper ARIA attributes
 * - Multiple sizes (small, medium, large, fullscreen)
 * - Backdrop click to close (configurable)
 * - Smooth open/close animations
 * - Body scroll lock when open
 * - Stacked z-index management
 *
 * Props:
 * @prop {Boolean} open - Whether dialog is open
 * @prop {String} size - Dialog size (small, medium, large, fullscreen)
 * @prop {Boolean} closeOnBackdrop - Whether clicking backdrop closes dialog
 * @prop {Boolean} closeOnEsc - Whether ESC key closes dialog
 * @prop {String} ariaLabel - Accessible label for screen readers
 * @prop {String} ariaLabelledby - ID of element that labels the dialog
 * @prop {String} ariaDescribedby - ID of element that describes the dialog
 *
 * Events:
 * @emits {Event} close - Emitted when dialog should be closed
 * @emits {Event} open - Emitted when dialog opens
 * @emits {Event} opened - Emitted after dialog open animation completes
 * @emits {Event} closed - Emitted after dialog close animation completes
 *
 * Slots:
 * @slot default - Dialog content
 * @slot header - Dialog header content
 * @slot footer - Dialog footer content
 */

import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X } from 'lucide-vue-next'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value),
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: null,
  },
  ariaLabelledby: {
    type: String,
    default: null,
  },
  ariaDescribedby: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close', 'open', 'opened', 'closed'])

// ============================================================================
// REACTIVE STATE
// ============================================================================

const dialogRef = ref(null)
const backdropRef = ref(null)
const isVisible = ref(false)
const previousActiveElement = ref(null)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const dialogClasses = ref([
  'base-dialog',
  `base-dialog--${props.size}`,
  {
    'base-dialog--visible': isVisible.value,
  },
])

// ============================================================================
// WATCHERS
// ============================================================================

watch(
  () => props.open,
  async (newValue) => {
    if (newValue) {
      await openDialog()
    } else {
      await closeDialog()
    }
  },
)

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

const focusableElementsSelector = [
  'button',
  '[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ')

const getFocusableElements = () => {
  if (!dialogRef.value) return []
  return Array.from(dialogRef.value.querySelectorAll(focusableElementsSelector)).filter(
    (el) => !el.disabled && el.offsetParent !== null,
  )
}

const trapFocus = (event) => {
  if (!dialogRef.value) return

  const focusableElements = getFocusableElements()
  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      // Shift + Tab: if focused on first element, move to last
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab: if focused on last element, move to first
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

const setInitialFocus = () => {
  nextTick(() => {
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else if (dialogRef.value) {
      dialogRef.value.focus()
    }
  })
}

const restoreFocus = () => {
  if (previousActiveElement.value && previousActiveElement.value.focus) {
    previousActiveElement.value.focus()
  }
}

// ============================================================================
// BODY SCROLL LOCK
// ============================================================================

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = getScrollbarWidth() + 'px'
}

const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.style.cssText =
    'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

// ============================================================================
// DIALOG MANAGEMENT
// ============================================================================

const openDialog = async () => {
  // Store currently focused element
  previousActiveElement.value = document.activeElement

  // Show dialog
  isVisible.value = true

  // Lock body scroll
  lockBodyScroll()

  // Add event listeners
  document.addEventListener('keydown', handleKeyDown)

  // Emit open event
  emit('open')

  // Set initial focus
  setInitialFocus()

  // Emit opened event after animation
  setTimeout(() => {
    emit('opened')
  }, 300)
}

const closeDialog = async () => {
  // Hide dialog
  isVisible.value = false

  // Remove event listeners
  document.removeEventListener('keydown', handleKeyDown)

  // Unlock body scroll
  unlockBodyScroll()

  // Restore focus
  restoreFocus()

  // Emit closed event after animation
  setTimeout(() => {
    emit('closed')
  }, 300)
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc) {
    handleClose()
  } else if (event.key === 'Tab') {
    trapFocus(event)
  }
}

const handleBackdropClick = (event) => {
  if (props.closeOnBackdrop && event.target === backdropRef.value) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  if (props.open) {
    openDialog()
  }
})

onUnmounted(() => {
  unlockBodyScroll()
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="isVisible"
        ref="backdropRef"
        class="base-dialog-backdrop"
        @click="handleBackdropClick"
      >
        <div
          ref="dialogRef"
          :class="dialogClasses"
          role="dialog"
          :aria-modal="true"
          :aria-label="ariaLabel"
          :aria-labelledby="ariaLabelledby"
          :aria-describedby="ariaDescribedby"
          tabindex="-1"
        >
          <!-- Close button -->
          <button
            class="base-dialog__close-button"
            type="button"
            aria-label="Close dialog"
            @click="handleClose"
          >
            <X :size="20" />
          </button>

          <!-- Dialog header -->
          <header v-if="$slots.header" class="base-dialog__header">
            <slot name="header" />
          </header>

          <!-- Dialog content -->
          <div class="base-dialog__content">
            <slot />
          </div>

          <!-- Dialog footer -->
          <footer v-if="$slots.footer" class="base-dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

// -------------------------------------------------------------------------
// BACKDROP
// -------------------------------------------------------------------------

.base-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: colors.$bg-overlay;
  z-index: variables.$z-index-modal-backdrop;
  @include mixins.flex-center;
  padding: variables.$spacing-2;

  @include mixins.width-at-least('medium') {
    padding: variables.$spacing-4;
  }
}

// -------------------------------------------------------------------------
// DIALOG
// -------------------------------------------------------------------------

.base-dialog {
  position: relative;
  background: colors.$bg-card;
  border-radius: variables.$border-radius-large;
  box-shadow: variables.$shadow-xl;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  z-index: variables.$z-index-modal;

  // -------------------------------------------------------------------------
  // SIZES
  // -------------------------------------------------------------------------

  &--small {
    width: 100%;
    max-width: 40rem;
  }

  &--medium {
    width: 100%;
    max-width: 60rem;
  }

  &--large {
    width: 100%;
    max-width: 80rem;
  }

  &--fullscreen {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;

    @include mixins.width-at-least('large') {
      width: 95vw;
      height: 95vh;
      border-radius: variables.$border-radius-large;
    }
  }

  // -------------------------------------------------------------------------
  // CLOSE BUTTON
  // -------------------------------------------------------------------------

  &__close-button {
    @include mixins.button-reset;
    position: absolute;
    top: variables.$spacing-2;
    right: variables.$spacing-2;
    width: 3.2rem;
    height: 3.2rem;
    @include mixins.flex-center;
    color: colors.$text-muted;
    border-radius: variables.$border-radius-medium;
    transition: all variables.$transition-normal;
    z-index: 1;

    &:hover {
      background: rgba(colors.$primary-green, 0.1);
      color: colors.$primary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  &__header {
    padding: variables.$spacing-3 variables.$spacing-3 variables.$spacing-2;
    border-bottom: 1px solid colors.$border-light;
    padding-right: 5rem; // Space for close button

    h1,
    h2,
    h3 {
      margin: 0;
      color: colors.$text-secondary;
    }
  }

  // -------------------------------------------------------------------------
  // CONTENT
  // -------------------------------------------------------------------------

  &__content {
    padding: variables.$spacing-3;
    flex: 1;
    overflow-y: auto;
    color: colors.$text-secondary;

    // If no header, add top padding for close button
    .base-dialog:not(:has(.base-dialog__header)) & {
      padding-top: 5rem;
    }
  }

  // -------------------------------------------------------------------------
  // FOOTER
  // -------------------------------------------------------------------------

  &__footer {
    padding: variables.$spacing-2 variables.$spacing-3 variables.$spacing-3;
    border-top: 1px solid colors.$border-light;
    @include mixins.flex-between;
    gap: variables.$spacing-2;

    // Stack actions on mobile
    @include mixins.width-less-than('medium') {
      flex-direction: column-reverse;
      align-items: stretch;
    }
  }
}

// -------------------------------------------------------------------------
// RESPONSIVE ADJUSTMENTS
// -------------------------------------------------------------------------

@include mixins.width-less-than('medium') {
  .base-dialog-backdrop {
    padding: variables.$spacing-1;
  }

  .base-dialog {
    &__header {
      padding: variables.$spacing-2 variables.$spacing-2 variables.$spacing-1_5;
      padding-right: 4.5rem;
    }

    &__content {
      padding: variables.$spacing-2;

      .base-dialog:not(:has(.base-dialog__header)) & {
        padding-top: 4.5rem;
      }
    }

    &__footer {
      padding: variables.$spacing-1_5 variables.$spacing-2 variables.$spacing-2;
    }

    &__close-button {
      top: variables.$spacing-1_5;
      right: variables.$spacing-1_5;
      width: 2.8rem;
      height: 2.8rem;
    }
  }
}

// -------------------------------------------------------------------------
// TRANSITIONS
// -------------------------------------------------------------------------

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity variables.$transition-normal;

  .base-dialog {
    transition: transform variables.$transition-normal;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;

  .base-dialog {
    transform: scale(0.9) translateY(-2rem);
  }
}

// -------------------------------------------------------------------------
// ACCESSIBILITY
// -------------------------------------------------------------------------

// High contrast mode support
@media (prefers-contrast: high) {
  .base-dialog {
    border: 3px solid colors.$border-dark;

    &__header,
    &__footer {
      border-width: 3px;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .dialog-enter-active,
  .dialog-leave-active {
    transition: none;

    .base-dialog {
      transition: none;
    }
  }

  .base-dialog__close-button {
    transition: none;
  }
}
</style>
