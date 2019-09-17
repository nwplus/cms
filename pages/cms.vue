<template>
  <div
    :class="
      `sponsor-page ${darkmode ? 'has-text-white has-background-dark' : ''}`
    "
  >
    <button @click="logout">Logout</button>
    <button @click="switchMode">dark mode</button>
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
    <IntroText
      :originalIntroTexts="introTexts"
      :selectedWebsite="selectedWebsite"
    ></IntroText>
    <Sponsors
      :websites="websites"
      :selected-website="selectedWebsite"
    ></Sponsors>
    <Events
      :selectedWebsite="selectedWebsite"
      :originalEvents="events"
    ></Events>
    <Faq
      :website="selectedWebsite"
      :listOfFaq="faq"
      @refreshData="refreshData(selectedWebsite)"
    />
  </div>
</template>

<script>
/* eslint-disable no-console,import/no-duplicates,prettier/prettier */
import firebase from 'firebase'
import { auth } from '~/plugins/firebase'
import fireDb from '~/plugins/firebase'
import Faq from '~/components/FAQ.vue'
import IntroText from '~/components/IntroText'
import Sponsors from '~/components/Sponsors'
import Events from '../components/Events'

export default {
  components: {
    Events,
    IntroText,
    Sponsors,
    Faq
  },
  computed: {
    darkmode () {
      return this.$store.state.darkmode
    },
  },
  async asyncData({ redirect }) {
    auth.onAuthStateChanged(async function(user) {
      if (!user) {
        redirect('/')
      }
      if (!(await fireDb.isAdmin(user.email))) redirect('/')
    })
    const listOfWebsites = await fireDb.getWebsites()
    const introTexts = await fireDb.getIntroText()
    const events = await fireDb.getEvents()
    const selectedWebsite = listOfWebsites[0]
    return {
      websites: listOfWebsites,
      introTexts: introTexts,
      events: events,
      selectedWebsite: selectedWebsite,
      files: [],
      faq: []
    }
  },
  methods: {
    switchMode() {this.$store.commit('switchMode')},
    async logout() {
      try {
        await firebase.auth().signOut()
        this.$router.push('/')
      } catch (error) {
        alert(error)
      }
    },
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
input[type='file'] {
  position: absolute;
  top: -500px;
}
#website-select {
  display: flex;
}
</style>
