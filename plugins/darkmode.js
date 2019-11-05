import Vue from 'vue'

Vue.mixin({
  computed: {
    darkmodeBackground() {
      return this.$store.state.darkmode ? 'has-background-black' : ''
    },
    darkmodeText() {
      return this.$store.state.darkmode ? 'has-text-light' : ''
    },
    isLight() {
      return this.$store.state.darkmode ? 'is-dark' : 'is-light'
    }
  }
})
