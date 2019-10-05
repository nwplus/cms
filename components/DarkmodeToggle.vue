<template>
  <div class="toggleBotton">
    <div @click="switchMode">
      {{ darkmode ? `🌞` : '🌙' }}
    </div>
  </div>
</template>
<script>
import { analytics } from '~/plugins/firebase'

export default {
  computed: {
    darkmode() {
      return this.$store.state.darkmode
    }
  },
  methods: {
    switchMode() {
      analytics.logEvent('Switched mode', {
        mode: `${this.darkmode ? 'Light' : 'Dark'}`
      })
      this.$store.commit('switchMode')
    }
  }
}
</script>
<style scoped>
.toggleBotton {
  user-select: none;
}
</style>
