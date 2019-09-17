export const state = () => ({
  darkmode: true
})

export const mutations = {
  switchMode(state) {
    state.darkmode = !state.darkmode
  }
}
