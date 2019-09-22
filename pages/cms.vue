<template>
  <div
    :class="
      `hero sponsor-page is-fullheight ${darkmodeText} ${darkmodeBackground}`
    "
  >
    <div style="display: flex;">
      <darkmodeToggle />
      <button @click="logout">Logout</button>
    </div>
    <div class="container has-text-centered">
      <div class="level">
        <div class="level-item has-text-centered">
          <nw>
            <img
              class="nwpluslogo"
              src="~/assets/nwplus.svg"
              alt="nwplus logo"
            />
          </nw>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p :class="`title ${darkmodeText}`">
              nwPlus Content Management System
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="website-select">
      <p>Website select:</p>
      <button
        v-for="w in websites"
        :key="w.key"
        :value="w"
        @click="changeWebsite($event)"
      >
        {{ w }}
      </button>
    </div>
    <hr />
    <IntroText
      :originalIntroTexts="introTexts"
      :selectedWebsite="selectedWebsite"
    ></IntroText>
    <hr />
    <Sponsors
      :websites="websites"
      :selected-website="selectedWebsite"
    ></Sponsors>
    <hr />
    <Events
      :selectedWebsite="selectedWebsite"
      :originalEvents="events"
    ></Events>
    <hr />
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
import Events from '../components/Events'
import { auth } from '~/plugins/firebase'
import fireDb from '~/plugins/firebase'
import Faq from '~/components/FAQ.vue'
import IntroText from '~/components/IntroText'
import Sponsors from '~/components/Sponsors'
import darkmodeToggle from '~/components/DarkmodeToggle'

export default {
  components: {
    Events,
    darkmodeToggle,
    IntroText,
    Sponsors,
    Faq
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
  text-align: center;
}
.nwpluslogo {
  height: 30px;
  padding-right: 30%;
}
.title {
  font-size: 20px;
}
</style>
