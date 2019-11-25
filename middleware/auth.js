/* eslint-disable no-console */
import fireDb, { auth } from '~/plugins/firebase'
export default function({ redirect, route, store }) {
  if (!route.path.includes('/cms')) {
    if (store.state.loggedIn) {
      redirect('/cms')
    }
  }
  auth.onAuthStateChanged(async function(user) {
    if (user) {
      const isAdmin = await fireDb.isAdmin(user.email)
      if (isAdmin) {
        store.commit('login')
      } else {
        store.commit('logout')
      }
      if (!route.path.includes('/cms')) {
        if (user && isAdmin) {
          redirect('/cms')
        }
      } else if (!route.path.includes('/signUp') && !isAdmin) {
        redirect('/signUp')
      }
    } else if (route.path !== '/') {
      store.commit('logout')
      redirect('/')
    }
  })
}
