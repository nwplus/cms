<template>
  <div :class="`cms hero is-fullheight ${darkmodeText} ${darkmodeBackground}`">
    <div style="display: flex; width: 120px">
      <darkmodeToggle />
      <honkToggle />
      <button
        style="margin: auto;"
        class="button is-small is-danger"
        @click="logout"
      >
        Logout
      </button>
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
        class="button is-small"
        :class="selectedWebsite === w ? 'is-primary is-focused' : 'is-link'"
        style="margin: 0 1%;"
        :value="w"
        @click="changeWebsite($event)"
      >
        {{ w }}
      </button>
    </div>
    <div
      v-if="selectedWebsite === 'NwHacks_2020'"
      style="margin-top:1%;"
      class="has-text-centered"
    >
      <button
        :style="{ width: '15vw', minWidth: '180px' }"
        class="button is-info is-small is-rounded"
        @click="getApplicantCsv"
      >
        Download Applicants CSV
      </button>
      <a href="https://assesment.nwplus.io/" target="_blank" rel="noopener">
        <button
          :style="{ width: '15vw', minWidth: '180px' }"
          class="button is-success is-small is-rounded"
        >
          Applicant Assessment
        </button>
      </a>
    </div>
    <div id="applicantNumber" :class="`${darkmodeText}`">
      <div id="applicantNumberContainer" style="display: inline-block;">
        <p style="margin: auto; top: 20%;">
          nwHacks Applicants: {{ applicantCount }}
          <br />
          nwHacks scored: {{ scoredCount }}/{{ applicantCount }}
          <br />
          nwHacks Accepted: {{ acceptedCount }}
        </p>
      </div>
    </div>
    <hr />
    <Flags
      class="indented"
      :flags="featureFlags[selectedWebsite]"
      :website="selectedWebsite"
    />
    <hr />
    <IntroText
      class="indented"
      :originalIntroTexts="introTexts"
      :selectedWebsite="selectedWebsite"
    ></IntroText>
    <hr />
    <Sponsors
      class="indented"
      :websites="websites"
      :selected-website="selectedWebsite"
      :sponsors="sponsorsList"
      :reload="reloadSponsors"
    ></Sponsors>
    <hr />
    <Events
      class="indented"
      :selectedWebsite="selectedWebsite"
      :originalEvents="events"
    ></Events>
    <hr />
    <Faq
      class="indented"
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
import fireDb from '~/plugins/firebase'
import Faq from '~/components/FAQ.vue'
import IntroText from '~/components/IntroText'
import Sponsors from '~/components/Sponsors'
import darkmodeToggle from '~/components/DarkmodeToggle'
import Flags from '~/components/Flags'
import honkToggle from '~/components/honkToggle'
export default {
  components: {
    Events,
    darkmodeToggle,
    IntroText,
    Sponsors,
    Faq,
    Flags,
    honkToggle
  },
  data() {
    return {
      applicantCount: 0,
      acceptedCount: 0,
      scoredCount: 0
    }
  },
  computed: {
    selectedWebsite: {
      get() {
        const selectedSite = this.$store.state.selectedWebsite
        return selectedSite && this.websites.includes(selectedSite) ? selectedSite : this.websites[0]
      },
      set(newValue) {
        this.$store.commit('setWebsite', newValue)
      }
    }
  },
  async asyncData({ redirect }) {
    const listOfWebsites = await fireDb.getWebsites()
    const introTexts = await fireDb.getIntroText()
    const events = await fireDb.getEvents()
    const flags = await fireDb.getFlags()
    const sponsorsList = await fireDb.getSponsors()
    return {
      websites: listOfWebsites,
      introTexts: introTexts,
      events: events,
      files: [],
      faq: [],
      featureFlags: flags,
      sponsorsList
    }
  },
  mounted() {
    fireDb.getNumberOfApplicants(this.setApplicantNumber)
    fireDb.getNumberOfAccepted(this.setAcceptedCount)
    fireDb.getScored(this.setScoredCount)
  },
  methods: {
    setApplicantNumber(snapshot) {
      this.applicantCount = snapshot.docs.length
    },
    setAcceptedCount(snapshot) {
      this.acceptedCount = snapshot.docs.length
    },
    setScoredCount(snapshot) {
      console.log(snapshot.docs)
      this.scoredCount = snapshot.docs.length
    },
    async getApplicantCsv() {
      const csv = await fireDb.applicantToCSV()
      const blob = new Blob([csv], {
        type: 'text/csv'
      })
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = 'Applicants.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a)
    },
    async reloadSponsors() {
      this.sponsorsList = await fireDb.getSponsors()
    },
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

<style lang="scss" scoped>
@import "~bulma/sass/utilities/_all";
#applicantNumber {
  font-size: 1.5em;
  height: 20%;
  margin: auto;
  text-align: center;
  @include until($tablet) {
    position: relative;
    width: auto;
  }
}
#applicantNumberContainer{
  margin-top: 10%;
  @include until($tablet){
    margin-top: 5%;
  }
}
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
.indented {
  margin-left: 1.5%;
}
</style>
