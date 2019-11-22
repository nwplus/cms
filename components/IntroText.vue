<template>
  <div id="intro">
    <p :class="`title is-4 ${darkmodeText}`">Intro</p>
    <div id="intro-header">
      <button v-if="!editingIntro" @click="startEditingIntro">Edit</button>
      <p v-if="editingIntro" id="intro-cancel" @click="cancelEditingIntro">
        Cancel
      </p>
      <p v-if="editingIntro" id="intro-save" @click="saveEditingIntro">
        Save
      </p>
    </div>
    <div v-if="!editingIntro" class="intro-body">
      <p>Intro text: {{ introTexts[selectedWebsite].introText }}</p>
      <p v-if="introTexts[selectedWebsite].introSubtext">
        Intro sub text: {{ introTexts[selectedWebsite].introSubtext }}
      </p>
      <div v-if="introTexts[selectedWebsite].introButtonEnabled !== undefined">
        <p>
          Sign up button enabled:
          {{ introTexts[selectedWebsite].introButtonEnabled }}
        </p>
        <p>
          Sign up button link: {{ introTexts[selectedWebsite].introButtonLink }}
        </p>
        <p>
          Sign up button text (on the button):
          {{ introTexts[selectedWebsite].introSignUpButtonText }}
        </p>
        <p>
          Sign up text (under the buttons):
          {{ introTexts[selectedWebsite].introSignUpText }}
        </p>
      </div>
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
      <div v-if="introTexts[selectedWebsite].introButtonEnabled !== undefined">
        <div class="checkbox-div">
          <p>Sign up button enabled</p>
          <input
            v-model="introTexts[selectedWebsite].introButtonEnabled"
            type="checkbox"
          />
        </div>
        <p>Sign up button link</p>
        <textarea
          v-model="introTexts[selectedWebsite].introButtonLink"
          class="intro-input"
        />
        <p>Sign up button text (on the button)</p>
        <textarea
          v-model="introTexts[selectedWebsite].introSignUpButtonText"
          class="intro-input"
        />
        <p>Sign up text (under the buttons</p>
        <textarea
          v-model="introTexts[selectedWebsite].introSignUpText"
          class="intro-input"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable standard/computed-property-even-spacing */

import firebase from 'firebase/app'
import fireDb from '~/plugins/firebase'

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
      editingIntro: false,
      originalIntroText: '',
      originalIntroSubtext: '',
      originalSelectedWebsite: this.selectedWebsite
    }
  },
  watch: {
    selectedWebsite: function() {
      if (this.editingIntro) this.cancelEditingIntro()
    }
  },
  methods: {
    startEditingIntro() {
      this.originalIntroText = this.introTexts[this.selectedWebsite].introText
      this.originalIntroSubtext = this.introTexts[
        this.selectedWebsite
      ].introSubtext

      this.originalSelectedWebsite = this.selectedWebsite

      this.editingIntro = true
    },
    stopEditingIntro() {
      this.originalIntroText = ''
      this.originalIntroSubtext = ''
      this.editingIntro = false
    },
    cancelEditingIntro() {
      this.introTexts[
        this.originalSelectedWebsite
      ].introText = this.originalIntroText
      this.introTexts[
        this.originalSelectedWebsite
      ].introSubtext = this.originalIntroSubtext

      this.stopEditingIntro()
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
        this.introTexts[this.selectedWebsite].introLastEditedDate,
        this.introTexts[this.selectedWebsite].introButtonEnabled,
        this.introTexts[this.selectedWebsite].introButtonLink,
        this.introTexts[this.selectedWebsite].introSignUpButtonText,
        this.introTexts[this.selectedWebsite].introSignUpText
      )
      this.stopEditingIntro()
    }
  }
}
</script>

<style scoped>
.checkbox-div {
  display: flex;
  vertical-align: middle;
}
.checkbox-div > input {
  margin: 5px;
  margin-bottom: 2.5%;
}

#intro-header {
  display: flex;
}

#intro-cancel,
#intro-save {
  margin-left: 20px;
  cursor: pointer;
}

#intro {
  width: 100%;
}

.intro-body {
  display: block;
}

.last-edited-by {
  font-size: 0.75rem;
}

.intro-input {
  width: 90%;
}
</style>
