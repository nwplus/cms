<template lang="html">
  <div>
    <p :class="`title is-4 ${darkmodeText}`">
      Flags (Show and hide components)
    </p>
    <p v-if="isEmpty()">No flags to show!</p>
    <div v-if="!isEmpty()">
      <button @click="editing = !editing">
        {{ editing ? 'cancel' : 'edit' }}
      </button>
      <button v-if="editing" @click="saveInfo">Save</button>
      <div v-for="(flag, key) in flags" :key="key" class="flags">
        <p>{{ key.replace('Flag', '') }}:</p>
        <select v-if="editing" :id="key" @change="updateFlags">
          <option :selected="flag" :value="true">Enabled</option>
          <option :selected="!flag" :value="false">Disabled</option>
        </select>
        <p v-if="!editing">{{ flag ? 'Enabled ✅' : 'Disabled ❌' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console,import/no-duplicates,prettier/prettier */
import fireDb from '~/plugins/firebase'

export default {
  props: {
    flags: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    website: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      editing: false
    }
  },
  watch: {
    website() {
      this.editing = false
    }
  },
  methods: {
    updateFlags(event) {
      this.flags[event.target.id] = event.target.value === "true"
    },
    async saveInfo() {
      await fireDb.updateFlags(this.website, this.flags)
      this.editing = false
    },
    isEmpty() {
      for (const key in this.flags) {
        if (hasOwnProperty.call(this.flags, key)) return false;
      }
      return true
    }
  }
}
</script>

<style scoped>
.flags {
  display: flex;
    padding-top: 2%;

}
.flags > p {
  padding-right: 1vw;
}
</style>
