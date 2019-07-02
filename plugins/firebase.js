/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/firestore'
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
const db = firebase.firestore()
const storage = firebase.storage()
const webCollection = 'Website_content'

const fireDb = {
  getWebsites: async () => {
    const ref = db.collection(webCollection)
    return (await ref.get()).docs.map(doc => doc.id)
  },
  addSponsorInformation: async (website, sponsors) => {
    console.log(sponsors)
    const ref = db
      .collection('Website_content')
      .doc(website)
      .collection('Sponsors')
    for (const sponsor of sponsors) {
      await ref.add({
        image: sponsor.image,
        name: sponsor.name,
        url: sponsor.url
      })
    }
  },
  uploadImages: async (website, files) => {
    for (const file of files) {
      const ref = storage.ref(`${website}/${file.name}`)
      await ref.put(file)
    }
  }
}

export default fireDb
