<template>
  <div>
    <section :class="`hero ${darkmodeBackground} is-fullheight`">
      <div style="display: flex; width: 120px">
        <button
          style="margin: auto;"
          class="button is-small is-rounded is-info"
        >
          <darkmodeToggle />
        </button>
        <button
          style="margin: auto;"
          class="button is-small is-danger"
          @click="logout"
        >
          Logout
        </button>
      </div>
      <div :class="`centered ${darkmodeText} container`">
        <p :class="`title ${darkmodeText}`">
          You are not an admin! <br />
          If you work for nwPlus, please enter the password here
        </p>
        <div class="is-centered columns is-gapless">
          <div class="column is-one-quarter">
            <div :class="`control ${loadState}`">
              <input
                v-model="secret"
                :class="`input is-primary is-medium ${loadState}`"
                type="password"
                placeholder="password"
              />
            </div>
          </div>
          <div class="column is-one-quarter">
            <b-button
              :class="`is-primary is-medium ${loadState}`"
              @click="adminSignUp"
              >Activate admin account</b-button
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-console */
import fireDb, { auth } from '../plugins/firebase'
import darkmodeToggle from '~/components/DarkmodeToggle'

export default {
  name: 'Login',
  components: { darkmodeToggle },
  data() {
    return {
      error_message: '',
      secret: '',
      message: '',
      loadState: ''
    }
  },
  asyncData({ redirect }) {
    auth.onAuthStateChanged(async function(user) {
      if (user && (await fireDb.isAdmin(user.email))) {
        redirect('/cms')
      }
      if (!user) {
        redirect('/')
      }
    })
  },
  methods: {
    async adminSignUp() {
      this.loadState = 'is-loading'
      const uid = auth.currentUser.uid
      try {
        await this.$axios.post(process.env.signUpUrl, {
          uid: uid,
          pass: this.secret
        })
        this.$router.push('/cms')
      } catch (e) {
        this.loadState = ''
        alert('incorrect password')
      }
    },
    async logout() {
      try {
        await auth.signOut()
        this.$router.push('/')
      } catch (error) {
        alert(error)
      }
    }
  }
}
</script>

<style scoped>
.centered {
  text-align: center;
  padding: 15% 2%;
}
</style>
