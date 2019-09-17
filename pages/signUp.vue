<template>
  <div class="container">
    <div class="content">
      <h1>
        You are not an admin! If you work for nwplus, please enter the password
        here
      </h1>
      <br />
      <p>Password:</p>
      <input v-model="secret" />
      <button @click="adminSignUp">Activate admin account</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import fireDb, { auth } from '../plugins/firebase'

export default {
  name: 'Login',
  data() {
    return {
      error_message: '',
      secret: '',
      message: ''
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
      const uid = auth.currentUser.uid
      try {
        await this.$axios.post(process.env.signUpUrl, {
          uid: uid,
          pass: this.secret
        })
        this.$router.push('/cms')
      } catch (e) {
        alert('incorrect password')
      }
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}
.content {
  padding-top: 25%;
}
</style>
