<template>
  <div>
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
      {{ faq.data.timestamp }}
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
import firebase from '~/plugins/firebase'
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
      console.log(this.currentFaq)
      console.log(this.website)
    },
    async handleSave() {
      const firebaseTimestamp = {
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
      }
      this.data = { ...this.data, ...firebaseTimestamp }
      fireDb.update(this.website, 'Faq', this.currentFaq.id, this.data)
      this.listOfFaq = await fireDb.get(this.website, 'Faq')
    }
  }
}
</script>
