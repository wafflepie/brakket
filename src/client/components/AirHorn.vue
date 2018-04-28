<template>
  <span
    class="horn"
    tabindex="0"
    @click="play">
    {{ playing ? '🔊' : '🔈' }}
  </span>
</template>

<script>
import { Vue, Component } from "vue-property-decorator"

import hornSoundEffect from "../assets/audio/horn.mp3"

@Component({
  created() {
    this.audio.volume = 0.5
  },
})
export default class AirHorn extends Vue {
  audio = new Audio(hornSoundEffect)
  timeoutId = null
  playing = false

  play() {
    clearInterval(this.timeoutId)
    this.audio.pause()
    this.audio.currentTime = 0.15 // HACK: audio could be trimmed

    this.audio.play()
    this.playing = true

    this.timeoutId = setTimeout(() => {
      this.playing = false
    }, (this.audio.duration - 0.6) * 1000) // HACK: audio could be trimmed
  }
}
</script>

<style lang="scss" scoped>
.horn {
  cursor: pointer;
  display: inline-block;
  min-width: $horn-width;
  user-select: none;
}
</style>
