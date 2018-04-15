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
import throttle from "lodash.throttle"

import hornSoundEffect from "../assets/audio/horn.mp3"

@Component({
  created() {
    this.audio.volume = 0.5
    this.play = throttle(this.play, this.audio.duration * 1000)
  },
})
export default class AirHorn extends Vue {
  audio = new Audio(hornSoundEffect)
  playing = false

  play() {
    this.audio.play()
    this.playing = true

    setTimeout(() => {
      this.playing = false
    }, this.audio.duration * 1000)
  }
}
</script>

<style>
.horn {
  cursor: pointer;
  display: inline-block;
  margin: 0 0.5rem;
}
</style>
