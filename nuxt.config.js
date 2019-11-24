const envVars =
  process.env.DEPLOY_ENV === 'GH_PAGES' ||
  process.env.DEPLOY_ENV === 'PRODUCTION'
    ? {
        env: {
          FIREBASE_API_KEY: 'AIzaSyCBkQHeikIsiYZ2yOHiqH_mGJKDWMDU500',
          FIREBASE_AUTH_DOMAIN: 'nwhacks-2019.firebaseapp.com',
          FIREBASE_DATABASE_URL: 'https://nwhacks-2019.firebaseio.com',
          FIREBASE_PROJECT_ID: 'nwhacks-2019',
          FIREBASE_STORAGE_BUCKET: 'nwhacks-2019',
          F_REBASE_MEASUREMENT_ID: 'G-HVDSYY5XNS',
          FIREBASE_MESSAGING_SENDER_ID: '98283589440',
          RECAPTCHA_SITE_KEY: '6Lf-PXcUAAAAAKqB-M3SNbBz5D67TtHAo94_YwyJ',
          signUpUrl:
            'https://us-central1-nwhacks-2019.cloudfunctions.net/newAdmin/'
        }
      }
    : {
        env: {
          signUpUrl:
            'https://us-central1-nwhacks-2019-dev.cloudfunctions.net/newAdmin/'
        }
      }
export default {
  ...envVars,
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'nwPlus CMS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  css: [{ src: 'bulma/bulma.sass', lang: 'sass' }],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/darkmode.js',
    '~/plugins/Honk.js',
    { src: '~/plugins/vuex-persist', srr: false }
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/eslint-module',
    'sulpwn',
    '@nuxtjs/dotenv',
    [
      'nuxt-buefy',
      {
        css: false
      }
    ]
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
