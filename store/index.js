export const state = () => ({
  darkmode: true,
  selectedWebsite: '',
  loggedIn: false
})

export const mutations = {
  switchMode(state) {
    state.darkmode = !state.darkmode
  },
  setWebsite(state, website) {
    state.selectedWebsite = website
  },
  login(state) {
    state.loggedIn = true
  },
  logout(state) {
    state.loggedIn = false
  }
}
