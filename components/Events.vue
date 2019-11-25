<template>
  <div id="events">
    <b-modal
      class="has-text-white"
      :active.sync="addEditModal"
      :can-cancel="false"
    >
      <div class="field">
        <label for="title">Title</label>
        <input id="title" v-model="title" />
      </div>
      <div class="field">
        <label for="order">Order</label>
        <input id="order" v-model="order" />
      </div>
      <div class="field">
        <label for="text">Text</label>
        <input id="text" v-model="text" />
      </div>
      <div class="field">
        <label for="eventLink">Event Link</label>
        <input id="eventLink" v-model="eventLink" />
      </div>
      <div class="field">
        <label for="learnMoreLink">Learn More Link</label>
        <input id="learnMoreLink" v-model="learnMoreLink" />
      </div>
      <div class="field">
        <label for="signupLink">Signup Link</label>
        <input id="signupLink" v-model="signupLink" />
      </div>
      <div class="field">
        <label for="imageLink">Image Link</label>
        <input id="imageLink" v-model="imageLink" />
      </div>
      <button @click="save">Save</button>
      <button @click="cancel">Cancel</button>
    </b-modal>
    <b-modal
      class="has-text-white"
      :active.sync="viewModal"
      :on-cancel="cancel"
    >
      <p>Title: {{ title }}</p>
      <p>Order: {{ order }}</p>
      <p>Text: {{ text }}</p>
      <p>Event Link: {{ eventLink }}</p>
      <p>Learn More Link: {{ learnMoreLink }}</p>
      <p>Signup Link: {{ signupLink }}</p>
      <p>Image Link: {{ imageLink }}</p>
    </b-modal>
    <p :class="`title is-4 ${darkmodeText}`">Events</p>
    <div v-if="selectedWebsite === 'LHD_2020'">
      <p :class="darkmodeText">
        To disable a button, remove its link. Adding a link will re-enable the
        button.
      </p>
      <br />
    </div>
    <div id="events-header">
      <button @click="add_event">Add Event</button>
    </div>
    <table id="events-body" :class="`table ${darkmodeBackground}`">
      <thead>
        <tr>
          <th :class="darkmodeText">Event</th>
          <th :class="darkmodeText">Last Modified</th>
          <th :class="darkmodeText" colspan="3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(e, i) of events[selectedWebsite]" :key="e.key">
          <td :class="darkmodeText">{{ e.title }}</td>
          <td
            v-if="e.eventLastEditedBy && e.eventLastEditedDate"
            :class="darkmodeText"
          >
            {{ e.eventLastEditedDate }} by {{ e.eventLastEditedBy }}
          </td>
          <td v-else :class="darkmodeText">Never Modified</td>
          <td :class="darkmodeText">
            <button @click="view_event(i)">View</button>
          </td>
          <td :class="darkmodeText">
            <button @click="edit_event(i)">Edit</button>
          </td>
          <td :class="darkmodeText">
            <button @click="delete_event(i)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/* eslint-disable no-console */

import firebase from 'firebase/app'
import fireDb from '../plugins/firebase'

export default {
  name: 'Events',
  props: {
    originalEvents: {
      type: Object,
      default() {
        return {}
      }
    },
    selectedWebsite: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addEditModal: false,
      viewModal: false,
      title: '',
      order: '',
      text: '',
      eventLink: '',
      learnMoreLink: '',
      signupLink: '',
      imageLink: '',
      index: undefined,
      events: this.originalEvents,
      editing: false
    }
  },
  methods: {
    add_event() {
      this.events[this.selectedWebsite].push({})
      this.index = this.events[this.selectedWebsite].length - 1
      this.addEditModal = true
      return ''
    },
    view_event(index) {
      this.title = this.events[this.selectedWebsite][index].title
      this.order = this.events[this.selectedWebsite][index].order
      this.text = this.events[this.selectedWebsite][index].text
      this.eventLink = this.events[this.selectedWebsite][index].eventLink
      // eslint-disable-next-line prettier/prettier
      this.learnMoreLink = this.events[this.selectedWebsite][index].learnMoreLink
      this.signupLink = this.events[this.selectedWebsite][index].signupLink
      this.imageLink = this.events[this.selectedWebsite][index].imageLink
      this.viewModal = true
    },
    edit_event(index) {
      this.title = this.events[this.selectedWebsite][index].title
      this.order = this.events[this.selectedWebsite][index].order
      this.text = this.events[this.selectedWebsite][index].text
      this.eventLink = this.events[this.selectedWebsite][index].eventLink
      // eslint-disable-next-line prettier/prettier
      this.learnMoreLink = this.events[this.selectedWebsite][index].learnMoreLink
      this.signupLink = this.events[this.selectedWebsite][index].signupLink
      this.imageLink = this.events[this.selectedWebsite][index].imageLink

      this.editing = true
      this.index = index
      this.addEditModal = true
    },
    async delete_event(index) {
      if (confirm('Are you sure you with to delete this event?')) {
        await fireDb.delete(
          this.selectedWebsite,
          'Events',
          this.events[this.selectedWebsite][index].id
        )
        window.location.reload(true)
      }
    },
    cancel() {
      this.title = ''
      this.order = ''
      this.text = ''
      this.eventLink = ''
      this.learnMoreLink = ''
      this.signupLink = ''
      this.imageLink = ''

      if (this.index && !this.editing)
        this.events[this.selectedWebsite].splice(this.index, 1)

      this.index = undefined
      this.addEditModal = false
      this.editing = false
    },
    async save() {
      this.events[this.selectedWebsite][this.index].title = this.title
      this.events[this.selectedWebsite][this.index].order = this.order
      this.events[this.selectedWebsite][this.index].text = this.text
      this.events[this.selectedWebsite][this.index].eventLink = this.eventLink
      // eslint-disable-next-line prettier/prettier
      this.events[this.selectedWebsite][this.index].learnMoreLink = this.learnMoreLink
      this.events[this.selectedWebsite][this.index].signupLink = this.signupLink
      this.events[this.selectedWebsite][this.index].imageLink = this.imageLink

      if (!this.editing)
        await fireDb.addEvent(this.selectedWebsite, {
          title: this.title,
          order: this.order,
          text: this.text,
          eventLink: this.eventLink,
          learnMoreLink: this.learnMoreLink,
          signupLink: this.signupLink,
          imageLink: this.imageLink,
          eventLastEditedBy: firebase.auth().currentUser.email,
          eventLastEditedDate: new Date(Date.now())
        })
      else
        await fireDb.updateEvent(this.selectedWebsite, {
          id: this.events[this.selectedWebsite][this.index].id,
          title: this.title,
          order: this.order,
          text: this.text,
          eventLink: this.eventLink,
          learnMoreLink: this.learnMoreLink,
          signupLink: this.signupLink,
          imageLink: this.imageLink,
          eventLastEditedBy: firebase.auth().currentUser.email,
          eventLastEditedDate: new Date(Date.now())
        })
      this.index = undefined
      this.editing = false
      window.location.reload(true)
    }
  }
}
</script>

<style scoped lang="scss">
#events {
  width: 90vw;
}

#events-header {
  display: flex;
}

#events-body {
  display: block;
  overflow-x: scroll;
}

.field {
  display: flex;
}

.modal {
  color: white;
}
</style>
