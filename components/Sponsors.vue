<template>
  <div id="files-select">
    <div class="large-12 medium-12 small-12 cell">
      <label id="files-label" :class="`title is-4 ${darkmodeText}`"
        >Sponsors</label
      >
      <hr id="files-hr" />
      <div v-if="sponsors[selectedWebsite].length > 0" class="sponsors">
        <table class="sponsortable">
          <thead>
            <tr>
              <th :class="darkmodeText">Image</th>
              <th :class="darkmodeText">Sponsor</th>
              <th :class="darkmodeText">URL</th>
              <th :class="darkmodeText">Type</th>
              <th :class="darkmodeText">Delete</th>
            </tr>
          </thead>
          <tr
            v-for="sponsor in sponsors[selectedWebsite]"
            :key="sponsor.id"
            class="sponsorlist"
          >
            <td class="sponsorImage">
              <img :src="sponsor.data.imageUrl" />
            </td>
            <td>
              {{ sponsor.data.name }}
            </td>
            <td>
              <a href="sponsor.data.url">{{ sponsor.data.url }} </a>
            </td>
            <td>
              {{ sponsor.data.rank }}
            </td>
            <td>
              <button
                @click="
                  deleteSponsor(
                    sponsor.id,
                    sponsor.data.image,
                    sponsor.data.name
                  )
                "
              >
                ❌
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div v-else>Currently no Sponsors!</div>
      <hr id="files-hr" />
      <p :class="`title is-4 ${darkmodeText}`">Upload</p>
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
        <div v-for="rank in ranks" :key="ranks.indexOf(rank)">
          <input v-model="file.selectedRank" type="radio" :value="rank" />
          {{ rank }}
        </div>
      </div>
    </div>
    <br />
    <div class="large-12 medium-12 small-12 cell">
      <button id="add-files-button" @click="addFiles()">Add Images</button>
    </div>
    <br />
    <button @click="save">Save</button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import fireDb from '~/plugins/firebase'

export default {
  name: 'Sponsors',
  props: {
    websites: {
      type: Array,
      default() {
        return []
      }
    },
    sponsors: {
      type: Object,
      default() {
        return {}
      }
    },
    reload: {
      type: Function,
      default() {
        return () => {}
      }
    },
    selectedWebsite: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ranks: ['kilo', 'mega', 'giga', 'tera', 'in-kind'],
      files: []
    }
  },
  methods: {
    async deleteSponsor(id, image, name) {
      const response = confirm(`Are you sure you want to delete ${name}?`)
      if (response) {
        this.$nuxt.$loading.start()
        await fireDb.deleteSponsor(this.selectedWebsite, id, image)
        await this.reload()
        this.$nuxt.$loading.finish()
      }
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
        uploadedFiles[i].selectedRank = ''
        this.files.push(uploadedFiles[i])
      }
    },
    async save() {
      this.$nuxt.$loading.start()
      if (!this.websites.includes(this.selectedWebsite)) {
        alert('Please select a website')
        return
      }
      const failedUploads = await fireDb.uploadImages(
        this.selectedWebsite,
        this.files
      )
      if (failedUploads.length > 0) {
        let alertString = 'Failed to upload the following files:'
        for (const file of failedUploads) alertString += `\n${file}`
        alert(alertString)
      }
      await this.reload()
      this.$nuxt.$loading.finish()

      this.files = []
    }
  }
}
</script>

<style scoped>
input[type='file'] {
  position: absolute;
  top: -500px;
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

.sponsortable {
  width: 80%;
}
table td,
table th {
  vertical-align: middle;
  border: 1px solid grey;
}
table td:not([align]),
table th:not([align]) {
  text-align: center;
}
.sponsorImage {
  width: 20%;
  background-color: white;
}
.sponsors {
  height: 350px;
  overflow-y: auto;
}
</style>
