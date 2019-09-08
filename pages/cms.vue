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
    <IntroText
      :originalIntroTexts="introTexts"
      :selectedWebsite="selectedWebsite"
    ></IntroText>
    <div id="files-select">
      <div class="large-12 medium-12 small-12 cell">
        <label id="files-label">Images</label>
        <hr id="files-hr" />
        <input
          id="files"
          ref="files"
          type="file"
          multiple
          @change="handleFileUpload()"
        />
      </div>
      <div class="large-12 medium-12 small-12 cell">
        <div v-for="(file, key) in files" :key="key" class="file-listing">
          <p class="file">{{ file.name }}</p>
          <p>Sponsor Name</p>
          <input v-model="file.sponsorName" />
          <p>Sponsor Url</p>
          <input v-model="file.url" />
          <p class="remove-file" @click="removeFile(key)">Remove</p>
        </div>
      </div>
      <br />
      <div class="large-12 medium-12 small-12 cell">
        <button id="add-files-button" @click="addFiles()">Add Images</button>
      </div>
      <br />
      <button @click="save">Save</button>
    </div>
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
import { auth } from '~/plugins/firebase'
import fireDb from '~/plugins/firebase'
import Faq from '~/components/FAQ.vue'
import IntroText from '../components/IntroText'

export default {
  components: {
    IntroText,
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
      faq: []
    }
  },
  methods: {
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

.file-listing {
  display: flex;
}
#files-hr {
  width: 15vw;
}
.file {
  width: 10vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 1vw 0 0;
}
.remove-file {
  color: red;
  cursor: pointer;
}
</style>
