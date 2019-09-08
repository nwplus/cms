<template>
  <div id="intro">
    <div id="intro-header">
      <p>Intro Text</p>
      <button v-if="!editingIntro" @click="startEditingIntro">Edit</button>
      <p v-if="editingIntro" id="intro-cancel" @click="stopEditingIntro">
        Cancel
      </p>
      <p v-if="editingIntro" id="intro-save" @click="saveEditingIntro">
        Save
      </p>
    </div>
    <div v-if="!editingIntro" class="intro-body">
      <p>{{ introTexts[selectedWebsite].introText }}</p>
      <p>{{ introTexts[selectedWebsite].introSubtext }}</p>
    </div>
    <div v-if="editingIntro" class="intro-body">
      <p
        v-if="
          introTexts[selectedWebsite].introLastEditedBy &&
            introTexts[selectedWebsite].introLastEditedBy
        "
        class="last-edited-by"
      >
        Last Edited By:
        {{ introTexts[selectedWebsite].introLastEditedBy }} at
        {{
          new Date(
            introTexts[selectedWebsite].introLastEditedDate
          ).toISOString()
        }}
      </p>
      <div id="title">
        <p>Title</p>
      </div>
      <textarea
        v-model="introTexts[selectedWebsite].introText"
        class="intro-input"
      />
      <p>Description</p>
      <textarea
        v-model="introTexts[selectedWebsite].introSubtext"
        class="intro-input"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable standard/computed-property-even-spacing */

import fireDb from '~/plugins/firebase'
import firebase from 'firebase/app'

export default {
  name: 'IntroText',
  props: {
    originalIntroTexts: {
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
      introTexts: this.originalIntroTexts,
      editingIntro: false
    }
  },
  watch: {
    selectedWebsite: function() {
      this.stopEditingIntro()
    }
  },
  methods: {
    startEditingIntro() {
      this.editingIntro = true
    },
    stopEditingIntro() {
      this.editingIntro = false
    },
    async saveEditingIntro() {
      this.introTexts[
        this.selectedWebsite
      ].introLastEditedBy = firebase.auth().currentUser.email
      this.introTexts[this.selectedWebsite].introLastEditedDate = Date.now()

      await fireDb.updateIntroText(
        this.selectedWebsite,
        this.introTexts[this.selectedWebsite].introText,
        this.introTexts[this.selectedWebsite].introSubtext,
        this.introTexts[this.selectedWebsite].introLastEditedBy,
        this.introTexts[this.selectedWebsite].introLastEditedDate
      )
      this.stopEditingIntro()
    }
  }
}
</script>

<style scoped></style>
