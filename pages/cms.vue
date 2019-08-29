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
  </div>
</template>

<script>
/* eslint-disable no-console,import/no-duplicates */

import firebase from '../plugins/firebase'
import { auth } from '../plugins/firebase'
import fireDb from '~/plugins/firebase'

export default {
  async asyncData({ redirect }) {
    auth.onAuthStateChanged(function(user) {
      if (!user) {
        redirect('/')
      }
    })
    const listOfWebsites = await firebase.getWebsites()
    const selectedWebsite = ''
    return {
      websites: listOfWebsites,
      selectedWebsite: selectedWebsite,
      files: [],
      faq: []
    }
  },
  methods: {
    async changeWebsite(e) {
      this.selectedWebsite = e.target.value
      this.faq = await fireDb.get(this.selectedWebsite, 'Faq')
    },
    addFiles() {
      this.$refs.files.click()
    },
    removeFile(key) {
      this.files.splice(key, 1)
    },
    handleFileUpload() {
      const uploadedFiles = this.$refs.files.files
      for (let i = 0; i < uploadedFiles.length; i++) {
        uploadedFiles[i].sponsorName = ''
        uploadedFiles[i].url = ''
        this.files.push(uploadedFiles[i])
      }
    },
    async save() {
      if (!this.websites.includes(this.selectedWebsite)) {
        alert('Please select a website')
        return
      }

      const failedUploads = await firebase.uploadImages(
        this.selectedWebsite,
        this.files
      )

      if (failedUploads.length > 0) {
        let alertString = 'Failed to upload the following files:'
        for (const file of failedUploads) alertString += `\n${file}`
        alert(alertString)
      }
      window.location.reload(true)
    }
  }
}
</script>

<style>
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
