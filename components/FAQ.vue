<template>
  <div>
    <div>
      <button @click="handleAddition()">Add FAQ</button>
    </div>
    <div v-for="faq in listOfFaq" :key="faq.id">
      <br />
      <input id="checkbox" v-model="faq.data.selected" type="checkbox" />
      Question:
      {{ faq.data.question }}
      <br />
      Category:
      {{ faq.data.category }}
      <br />
      Answer:
      {{ faq.data.answer }}
      <br />
      Timestamp:
      {{ new Date(faq.data.timestamp.toDate()) }}
      <br />
      Last edited by:
      {{ faq.data.user }}
      <br />
      <button>
        Details
      </button>
      <button @click="handleEdit(faq)">
        Edit
      </button>
    </div>
    <div v-if="editMode" id="editPanel">
      Edit
      <br />
      <input id="checkbox" v-model="data.selected" type="checkbox" />
      <br />
      <input v-model="data.question" />
      <br />
      <input v-model="data.category" />
      <br />
      <input v-model="data.answer" />
      <br />
      <button @click="handleSave()">
        Save
      </button>
      <button @click="handleRemoval()">Delete</button>
      <button @click="editMode = !editMode">Exit</button>
    </div>
  </div>
</template>
<style scoped>
#editPanel {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 30%;
}
</style>
<script>
/* eslint-disable no-console */
import fireDb, { auth } from '~/plugins/firebase'
export default {
  props: {
    website: {
      type: String,
      required: true
    },
    listOfFaq: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      editMode: false,
      currentFaq: {},
      data: {
        selected: true,
        question: '',
        category: '',
        answer: ''
      }
    }
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    handleEdit(faq) {
      this.editMode = !this.editMode
      this.currentFaq = faq
      this.data.selected = faq.data.selected
      this.data.question = faq.data.question
      this.data.category = faq.data.category
      this.data.answer = faq.data.answer
    },
    handleSave() {
      const firebaseTimestamp = {
        timestamp: fireDb.getTimestamp()
      }
      const user = auth.currentUser.displayName
      this.data = { ...this.data, ...firebaseTimestamp, user }
      if (this.currentFaq != null && this.currentFaq.id !== undefined) {
        fireDb.update(this.website, 'Faq', this.currentFaq.id, this.data)
      } else {
        fireDb.add(this.website, 'Faq', this.data)
      }
      this.editMode = !this.editMode
      this.refreshData()
    },
    handleAddition() {
      this.currentFaq = null
      this.editMode = !this.editMode
      this.data.selected = false
      this.data.question = 'Sample question'
      this.data.category = 'Sample category'
      this.data.answer = 'Sample answer'
      this.$emit('refreshData')
    },
    handleRemoval() {
      this.editMode = !this.editMode
      if (this.currentFaq != null && this.currentFaq.id !== undefined) {
        fireDb.delete(this.website, 'Faq', this.currentFaq.id)
      }
      this.refreshData()
    },
    refreshData() {
      this.$emit('refreshData')
    }
  }
}
</script>
