export const state = () => ({
  darkmode: false
})

export const mutations = {
  switchMode(state) {
    state.darkmode = !state.darkmode
  }
}
