<template>
  <div class="toggleBotton">
    <button
      style="margin: auto;"
      class="button is-small is-rounded is-info"
      @click="switchMode"
    >
      <div>
        {{ darkmode ? `🌞` : '🌙' }}
      </div>
    </button>
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
