<template>
  <div class="sponsor-page">
    <div id="website-select">
      <p>Website</p>
      <button
        v-for="w in websites"
        :key="w.key"
        :value="w"
        @click="changeWebsite($event)"
      >
        {{ w }}
      </button>
    </div>
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
    <Sponsors
      :websites="websites"
      :selected-website="selectedWebsite"
    ></Sponsors>
    <Faq
      :website="selectedWebsite"
      :list-of-faq="faq"
      @refreshData="refreshData(selectedWebsite)"
    />
  </div>
</template>

<script>
/* eslint-disable no-console,import/no-duplicates,prettier/prettier */

import firebase from 'firebase/app'
import { auth } from '../plugins/firebase'
import fireDb from '~/plugins/firebase'
import Faq from '~/components/FAQ.vue'
import Sponsors from '../components/Sponsors'

export default {
  components: {
    Sponsors,
    Faq
  },
  async asyncData({ redirect }) {
    auth.onAuthStateChanged(function(user) {
      if (!user) {
        redirect('/')
      }
    })
    const listOfWebsites = await fireDb.getWebsites()
    const introTexts = await fireDb.getIntroText()
    const selectedWebsite = listOfWebsites[0]
    return {
      websites: listOfWebsites,
      introTexts: introTexts,
      selectedWebsite: selectedWebsite,
      files: [],
      faq: [],
      editingIntro: false
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
      this.introTexts[this.selectedWebsite].introLastEditedBy = firebase.auth().currentUser.email
      this.introTexts[this.selectedWebsite].introLastEditedDate = Date.now()

      await fireDb.updateIntroText(
        this.selectedWebsite,
        this.introTexts[this.selectedWebsite].introText,
        this.introTexts[this.selectedWebsite].introSubtext,
        this.introTexts[this.selectedWebsite].introLastEditedBy,
        this.introTexts[this.selectedWebsite].introLastEditedDate
      )
      this.stopEditingIntro()
    },
    async changeWebsite(e) {
      this.selectedWebsite = e.target.value
      await this.refreshData()
    },
    async refreshData() {
      // add more lines to pull more data if needed
      this.faq = await fireDb.get(this.selectedWebsite, 'Faq')
    }
  }
}
</script>

<style scoped>
#website-select {
  display: flex;
}

#intro-header {
  display: flex;
  background-color: #ededed;
}

#intro-cancel,
#intro-save {
  margin-left: 20px;
  cursor: pointer;
}

#intro {
  width: 800px;
}

.intro-body {
  background-color: #f5f5f5;
  display: block;
}

.last-edited-by {
  font-size: 0.75rem;
}

.intro-input {
  width: 90%;
}
</style>
