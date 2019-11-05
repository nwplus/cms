<template>
  <div>
    <p :class="`title is-4 ${darkmodeText}`">FAQ</p>

    <div style="display: flex;">
      <button
        style="margin: auto 0;"
        :class="`button is-primary ${isLight}`"
        @click="handleAddition()"
      >
        Add a FAQ Question
      </button>
    </div>
    <div>
      <div :class="`table-container`">
        <table
          :class="
            `table is-fullwidth is-scrollable has-background-black ${darkmodeText}`
          "
        >
          <thead>
            <tr>
              <th :class="darkmodeText">
                Catagory
              </th>
              <th :class="darkmodeText">
                Question
              </th>
              <th :class="darkmodeText">
                Answer
              </th>
              <th :class="darkmodeText">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faq in listOfFaq" :key="faq.id">
              <td>
                {{ faq.data.category }}
              </td>
              <td>
                {{ faq.data.question }}
              </td>
              <td>
                {{ faq.data.answer }}
              </td>
              <td style="vertical-align: middle;">
                <button
                  :class="`button is-primary ${isLight}`"
                  @click="handleEdit(faq)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal
      class="has-text-white has-modal-card"
      :active.sync="showPanel"
      :can-cancel="false"
    >
      <div class="modal-card">
        <header class="modal-card-head has-background-dark">
          <p class="modal-card-title has-text-light">
            {{ editMode ? 'Editing a FAQ' : 'Add a FAQ' }}
          </p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section :class="`modal-card-body has-background-dark`">
          <div style="display: flex">
            <p style="width: 15%;" class="has-text-light title is-6">
              Catagory:
            </p>
            <div class="select is-small is-primary">
              <select v-model="data.category">
                <option disabled value="placeholder">Please select one</option>
                <option>General</option>
                <option>Teams</option>
                <option>Logistics</option>
              </select>
            </div>
          </div>
          <div style="display: flex;">
            <p style="width: 15%;" :class="`title is-6 has-text-light`">
              Question:
            </p>
            <input
              v-model="data.question"
              class="input is-primary is-small is-narrow"
            />
          </div>
          Answer:
          <textarea
            v-model="data.answer"
            class="textarea is-success is-small"
            placeholder="Answer"
            rows="3"
          ></textarea>
          <br />
          <button class="button is-small is-success" @click="handleSave()">
            Save
          </button>
          <button
            v-if="editMode"
            class="button is-small is-danger"
            @click="handleRemoval()"
          >
            Delete
          </button>
          <button
            class="button is-warning is-small"
            @click="
              editMode = false
              addMode = false
            "
          >
            Exit
          </button>
        </section>
      </div>
    </b-modal>
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
      addMode: false,
      currentFaq: {},
      data: {
        selected: true,
        question: '',
        category: '',
        answer: ''
      }
    }
  },
  computed: {
    showPanel() {
      return this.addMode || this.editMode
    }
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    handleEdit(faq) {
      this.editMode = true
      this.currentFaq = faq
      this.data.selected = true
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
      this.editMode = false
      this.addMode = false
      this.refreshData()
    },
    handleAddition() {
      this.currentFaq = null
      this.addMode = true
      this.data.selected = false
      this.data.question = 'Sample question'
      this.data.category = 'placeholder'
      this.data.answer = 'Sample answer'
      this.$emit('refreshData')
    },
    handleRemoval() {
      this.editMode = false
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
