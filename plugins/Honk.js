/* eslint-disable no-console */
import Vue from 'vue'
const audio = new Audio(
  'https://res.cloudinary.com/jlengstorf/video/upload/q_auto/v1569957993/honk-sound.mp3'
)
const honkify = (elementToHonkify = false) => {
  if (typeof window === 'undefined') {
    return
  }
  /**
   * if the platform is iOS Safari, we quickly play, pause, reset the audio object
   * this allows it to be playable the next time an user clicks a link
   */

  const links = elementToHonkify || document.querySelectorAll('a')

  const honk = event => {
    event.stopImmediatePropagation()

    audio.play()

    return false
  }

  links.forEach(link => {
    link.addEventListener('click', honk)
  })

  const dehonk = () => {
    links.forEach(link => {
      link.removeEventListener('click', honk)
    })
  }

  return dehonk
}
Vue.mixin({
  computed: {
    honking() {
      return this.$store.state.honk
    }
  },
  mounted() {
    if (this.honking) {
      const elementList = document.querySelectorAll('button')
      honkify(elementList)
    }
  },
  updated() {
    if (this.honking) {
      const elementList = document.querySelectorAll('button')
      honkify(elementList)
    }
  },
  methods: {
    honk() {
      audio.play()
    }
  }
})
