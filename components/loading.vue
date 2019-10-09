<template lang="html">
  <div v-if="loading" class="loading-page">
    <img class="loading-image" src="~/assets/nwplus.gif" />
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  text-align: center;
  padding-top: 200px;
  z-index: 100;
}
.loading-image {
  margin: auto;
  width: 10%;
}
</style>
