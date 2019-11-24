/* eslint-disable no-console */
import fireDb, { auth } from '~/plugins/firebase'
export default function({ redirect, route }) {
  auth.onAuthStateChanged(async function(user) {
    if (user) {
      const isAdmin = await fireDb.isAdmin(user.email)
      if (route.path !== '/cms') {
        if (user && isAdmin) {
          redirect('/cms')
        }
      } else if (route.path !== '/signUp' && !isAdmin) {
        redirect('/signUp')
      }
    } else if (route.path !== '/') {
      redirect('/')
    }
  })
}
