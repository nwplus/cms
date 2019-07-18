<template>
  <div>
    <button @click="googleSignIn">Log in with Google</button>
    <p id="error-message">{{ error_message }}</p>
  </div>
</template>

<script>
/* eslint-disable no-console */
import firebase from 'firebase/app'
import { auth } from '../plugins/firebase'

export default {
  name: 'Login',
  data() {
    return {
      error_message: ''
    }
  },
  methods: {
    async googleSignIn() {
      this.provider = new firebase.auth.GoogleAuthProvider()
      try {
        await auth.signInWithPopup(this.provider)
        this.$router.push('/cms')
      } catch (e) {
        console.log(e)
        if (e.code === 'auth/web-storage-unsupported') {
          this.error_message = 'Please enable 3rd party cookies'
        }
      }
    }
  }
}
</script>

<style scoped>
#error-message {
  color: red;
}
</style>
