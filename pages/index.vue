<template>
  <div>
    <section class="hero has-background-black centered is-fullheight">
      <div class="container has-text-centered">
        <div class="level">
          <div class="level-item has-text-centered">
            <div>
              <img
                class="nwpluslogo"
                src="~/assets/nwplus.svg"
                alt="nwplus logo"
              />
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="title has-text-light">
                nwPlus Content Management System
              </p>
            </div>
          </div>
        </div>
        <b-button :type="buttonState + ' is-primary'" @click="googleSignIn"
          >Login</b-button
        >
        <p id="error-message">{{ error_message }}</p>
      </div>
    </section>
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
      error_message: '',
      buttonState: ''
    }
  },
  asyncData({ redirect }) {
    auth.onAuthStateChanged(async function(user) {
      if (user && (await fireDb.isAdmin(user.email))) {
        redirect('/cms')
      } else if (user) {
        redirect('/signUp')
      }
    })
  },
  methods: {
    async googleSignIn() {
      this.buttonState = 'is-loading'
      this.provider = new firebase.auth.GoogleAuthProvider()
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        const res = await auth.signInWithPopup(this.provider)
        if (!(await fireDb.isAdmin(res.user.email))) {
          this.$router.push('/signUp')
          return
        }
        this.$router.push('/cms')
      } catch (e) {
        if (e.code === 'permission-denied') this.$router.push('/signUp')
        else if (e.code === 'auth/web-storage-unsupported') {
          this.error_message = 'Please enable 3rd party cookies'
        }
      }
    }
  }
}
</script>

<style scoped>
.nwpluslogo {
  height: 40px;
  padding-right: 30%;
}
.centered {
  padding-top: 15%;
}
#error-message {
  color: red;
}
</style>
