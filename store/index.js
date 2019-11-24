export const state = () => ({
  darkmode: true,
  selectedWebsite: ''
})

export const mutations = {
  switchMode(state) {
    state.darkmode = !state.darkmode
  },
  setWebsite(state, website) {
    state.selectedWebsite = website
  }
}
