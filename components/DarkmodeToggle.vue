<template>
  <div class="toggleBotton">
    <div @click="switchMode">
      {{ darkmode ? `🌞` : '🌙' }}
    </div>
  </div>
</template>
<script>
export default {
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
<style scoped>
.toggleBotton {
  user-select: none;
}
</style>
