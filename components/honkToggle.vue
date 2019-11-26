<template>
  <div class="toggleBotton">
    <button
      style="margin: auto;"
      class="button is-small is-rounded is-info"
      @click="switchMode"
    >
      <div style="width: 20px; margin: auto;">
        <img v-if="!honking" src="~/assets/goose_on.png" />
        <img v-else src="~/assets/goose_off.png" />
      </div>
    </button>
  </div>
</template>
<script>
export default {
  methods: {
    switchMode() {
      this.$store.commit('toggleHonk')
      window.location.reload(true)
    }
  }
}
</script>
<style scoped>
.toggleBotton {
  user-select: none;
}
</style>
