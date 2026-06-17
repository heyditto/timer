const CHIME_NOTES_HZ = [523.25, 659.25, 783.99, 1046.5]

/**
 * Soft three-note chime when a focus session completes. Uses Web Audio so we
 * do not need a bundled sound asset.
 */
export const playCompletionChime = () => {
  if (typeof window === "undefined") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const context = new AudioContext()
  const startAt = context.currentTime

  CHIME_NOTES_HZ.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const noteStart = startAt + index * 0.14

    oscillator.type = "sine"
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, noteStart)
    gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.4)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 1.5)
  })

  window.setTimeout(() => {
    void context.close()
  }, 2500)
}
