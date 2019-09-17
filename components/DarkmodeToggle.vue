<template>
  <div class="toggleBotton">
    <div @click="switchMode">
      {{ darkmode ? `🌞` : '🌙' }}
    </div>
  </div>
</template>
<style scoped>
.toggleBotton {
  user-select: none;
}
</style>
<script>
export default {
  /* eslint-disable no-console */
  computed: {
    darkmode() {
      return this.$store.state.darkmode
    }
  },
  methods: {
    switchMode() {
      this.$store.commit('switchMode')
    }
  }
}
</script>
