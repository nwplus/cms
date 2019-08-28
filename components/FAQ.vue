<template>
  <div>
    <div>
      <button @click="handleAddition()">Add</button>
    </div>
    <div v-for="faq in listOfFaq" :key="faq.id">
      <br />
      <input type="checkbox" id="checkbox" v-model="faq.data.selected" />
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
      <button>
        Details
      </button>
      <button @click="handleEdit(faq)">
        Edit
      </button>
    </div>
    <div id="editPanel" v-if="editMode">
      Edit
      <br />
      <input type="checkbox" id="checkbox" v-model="data.selected" />
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
import fireDb from '~/plugins/firebase'
export default {
  props: {
    website: {
      type: String,
      required: true
    },
    listOfFaq: {
      type: Array,
      required: false
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
      this.data = { ...this.data, ...firebaseTimestamp }
      if (this.currentFaq.id == null) {
        fireDb.update(this.website, 'Faq', this.currentFaq.id, this.data)
      } else {
        fireDb.add(this.website, 'Faq', this.data)
      }
      this.editMode = !this.editMode
      this.refreshData()
    },
    handleAddition() {
      this.editMode = !this.editMode
      this.data.selected = false
      this.data.question = 'Sample question'
      this.data.category = 'Sample category'
      this.data.answer = 'Sample answer'
      this.$emit('refreshData')
    },
    handleRemoval() {
      this.editMode = !this.editMode
      fireDb.delete(this.website, 'Faq', this.currentFaq.id)
      this.refreshData()
    },
    refreshData() {
      this.$emit('refreshData')
    }
  }
}
</script>
