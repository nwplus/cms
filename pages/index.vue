<template>
  <div>
    <section :class="`hero centered is-fullheight ${darkmodeBackground}`">
      <div style="position: absolute; top: 0%; user-select: none">
        <darkmodeToggle />
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
        <b-button :type="buttonState + ' is-primary'" @click="googleSignIn"
          >Login</b-button
        >
        <p id="error-message">{{ error_message }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import fireDb, { auth, analytics } from '../plugins/firebase'
import darkmodeToggle from '~/components/DarkmodeToggle.vue'

export default {
  name: 'Login',
  components: { darkmodeToggle },
  data() {
    return {
      error_message: '',
      buttonState: ''
    }
  },
  methods: {
    async googleSignIn() {
      this.buttonState = 'is-loading'
      this.provider = new firebase.auth.GoogleAuthProvider()
      try {
        const res = await auth.signInWithPopup(this.provider)
        this.honk()
        setTimeout(this.honk, 450)
        if (!(await fireDb.isAdmin(res.user.email))) {
          analytics.logEvent('notAdmin', res.user.email)
          this.$router.push('/signUp')
          return
        }
        analytics.logEvent('login', res.user.email)
        this.$router.push('/cms')
      } catch (e) {
        this.buttonState = ''
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
