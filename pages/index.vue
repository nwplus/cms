<template>
  <div>
    <button @click="googleSignIn">Log in with Google</button>
    <p id="error-message">{{ error_message }}</p>
  </div>
</template>

<script>
/* eslint-disable no-console */
import firebase from 'firebase/app'
import fireDb, { auth } from '../plugins/firebase'

export default {
  name: 'Login',
  data() {
    return {
      error_message: ''
    }
  },
  asyncData({ redirect }) {
    auth.onAuthStateChanged(async function(user) {
      if (user && (await fireDb.isAdmin(user.email))) redirect('/cms')
    })
  },
  methods: {
    async googleSignIn() {
      this.provider = new firebase.auth.GoogleAuthProvider()
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        const res = await auth.signInWithPopup(this.provider)
        if (!(await fireDb.isAdmin(res.user.email))) {
          alert('You are not an admin')
          return
        }
        this.$router.push('/cms')
      } catch (e) {
        if (e.code === 'permission-denied') alert('You are not an admin')
        else if (e.code === 'auth/web-storage-unsupported') {
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
