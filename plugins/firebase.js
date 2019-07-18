/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  }
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

const db = firebase.firestore()
const storage = firebase.storage()
const webCollection = 'Website_content'

const fireDb = {
  getWebsites: async () => {
    const ref = db.collection(webCollection)
    return (await ref.get()).docs.map(doc => doc.id)
  },
  addSponsorInformation: async (website, sponsor) => {
    const ref = db
      .collection('Website_content')
      .doc(website)
      .collection('Sponsors')
    await ref.add({
      image: sponsor.image,
      name: sponsor.name,
      url: sponsor.url
    })
  },
  async uploadImages(website, files) {
    const failedUploads = []

    for (const file of files) {
      try {
        const ref = storage.ref(`${website}/${file.name}`)
        await ref.put(file)
        await this.addSponsorInformation(website, {
          image: file.name,
          name: file.sponsorName.trim(),
          url: file.url.trim()
        })
      } catch (e) {
        console.log(e)
        failedUploads.push(file.name)
      }
    }

    return failedUploads
  }
}

export default fireDb
