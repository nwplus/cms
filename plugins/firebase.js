/* eslint-disable no-console */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/analytics'

if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    measurementId: 'G-HVDSYY5XNS',
    appId: '1:98283589440:web:c15c6169d0098fb15d34a5',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  }
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export const analytics = firebase.analytics()
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

const db = firebase.firestore()
const storage = firebase.storage()
const webCollection = 'Website_content'

const fireDb = {
  isAdmin: async email => {
    const ref = db.collection('admins')
    const admins = (await ref.get()).docs
    for (const admin of admins) {
      const col = ref.doc(admin.id)
      const userData = (await col.get()).data()
      if (userData.email === email) return true
    }
    return false
  },
  getFlags: async () => {
    const websites = await fireDb.getWebsites()
    const featureFlags = {}
    for (const website of websites) {
      const websiteDataRef = await db
        .collection(webCollection)
        .doc(website)
        .get()
      const websiteData = websiteDataRef.data()
      featureFlags[website] = websiteData.featureFlags
    }
    return featureFlags
  },
  updateFlags: async (website, flags) => {
    const websiteDataRef = db.collection(webCollection).doc(website)
    await websiteDataRef.update({ featureFlags: flags })
  },
  getWebsites: async () => {
    const ref = db.collection(webCollection)
    return (await ref.get()).docs.map(doc => doc.id)
  },
  getIntroText: async () => {
    const websites = await fireDb.getWebsites()
    const introTexts = {}
    for (const website of websites) {
      const websiteData = (await db
        .collection(webCollection)
        .doc(website)
        .get()).data()
      introTexts[website] = {
        introText: websiteData.IntroText
          ? websiteData.IntroText.toString()
          : '',
        introSubtext: websiteData.IntroSubtext
          ? websiteData.IntroSubtext.toString()
          : '',
        introLastEditedBy: websiteData.IntroLastEditedBy || undefined,
        introLastEditedDate: websiteData.IntroLastEditedDate || undefined,
        introButtonEnabled: websiteData.IntroButtonEnabled,
        introButtonLink: websiteData.IntroButtonLink,
        introSignUpText: websiteData.SignUpText
      }
    }
    return introTexts
  },
  getEvents: async () => {
    const websites = await fireDb.getWebsites()
    const events = {}
    for (const website of websites) {
      const websiteData = await db
        .collection(webCollection)
        .doc(website)
        .collection('Events')
        .get()
      events[website] = await websiteData.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          text: data.text || '',
          order: data.order,
          imageLink: data.imageLink || '',
          eventLink: data.eventLink || '',
          signupLink: data.signupLink || '',
          eventLastEditedBy: data.eventLastEditedBy || undefined,
          eventLastEditedDate: data.eventLastEditedDate || undefined,
          enabled: data.enabled
        }
      })
    }
    return events
  },
  addEvent: async (website, event) => {
    const ref = db
      .collection(webCollection)
      .doc(website)
      .collection('Events')
    await ref.add({
      title: event.title || '',
      order: parseInt(event.order) || -1,
      text: event.text || '',
      eventLink: event.eventLink || '',
      learnMoreLink: event.learnMoreLink || '',
      signupLink: event.signupLink || '',
      imageLink: event.imageLink || '',
      enabled: true,
      eventLastEditedBy: event.eventLastEditedBy,
      eventLastEditedDate: event.eventLastEditedDate.toDateString()
    })
  },
  updateEvent: async (website, event) => {
    const ref = db
      .collection(webCollection)
      .doc(website)
      .collection('Events')
      .doc(event.id)
    await ref.update({
      title: event.title || '',
      order: parseInt(event.order) || -1,
      text: event.text || '',
      eventLink: event.eventLink || '',
      learnMoreLink: event.learnMoreLink || '',
      signupLink: event.signupLink || '',
      imageLink: event.imageLink || '',
      eventLastEditedBy: event.eventLastEditedBy,
      eventLastEditedDate: event.eventLastEditedDate.toDateString()
    })
  },
  updateEventEnabled: async (website, event) => {
    const ref = db
      .collection(webCollection)
      .doc(website)
      .collection('Events')
      .doc(event.id)
    await ref.update({
      enabled: event.enabled
    })
  },
  updateIntroText: async (
    website,
    introText,
    introSubtext,
    user,
    date,
    enabled = undefined,
    signupLink = undefined,
    signupText = undefined
  ) => {
    const ref = db.collection(webCollection).doc(website)
    await ref.update({
      IntroText: introText,
      IntroSubtext: introSubtext,
      IntroLastEditedBy: user,
      IntroLastEditedDate: date,
      IntroButtonEnabled: enabled || false,
      IntroButtonLink: signupLink || '',
      SignUpText: signupText || ''
    })
  },
  addSponsorInformation: async (website, sponsor) => {
    const ref = db
      .collection(webCollection)
      .doc(website)
      .collection('Sponsors')
    await ref.add({
      image: sponsor.image,
      name: sponsor.name,
      url: sponsor.url,
      rank: sponsor.rank
    })
  },
  async uploadImages(website, files) {
    const failedUploads = []
    for (const file of files) {
      try {
        const ref = storage.ref(`${website}/${file.name}`)
        await ref.put(file)
      } catch (e) {
        console.log(e)
        failedUploads.push(file.name)
      }

      try {
        await this.addSponsorInformation(website, {
          image: file.name,
          name: file.sponsorName.trim(),
          url: file.url.trim(),
          rank: file.selectedRank
        })
      } catch (e) {
        const ref = storage.ref(`${website}/${file.name}`)
        await ref.delete()
        console.log(e)
        failedUploads.push(file.name)
      }
    }
    return failedUploads
  },
  get: async (webDocument, collection) => {
    if (collection === webDocument) {
      const ref = db.collection(webCollection).doc(webDocument)
      const data = await ref.get()
      return data.data()
    }
    const ref = db
      .collection(webCollection)
      .doc(webDocument)
      .collection(collection)
    return (await ref.get()).docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }))
  },
  update: (webDocument, collection, docId, object) => {
    db.collection(webCollection)
      .doc(webDocument)
      .collection(collection)
      .doc(docId)
      .update(object)
  },
  add: async (webDocument, collection, object) => {
    const ref = await db
      .collection(webCollection)
      .doc(webDocument)
      .collection(collection)
      .add(object)
    return ref.id
  },
  delete: async (webDocument, collection, docId) => {
    await db
      .collection(webCollection)
      .doc(webDocument)
      .collection(collection)
      .doc(docId)
      .delete()
  },
  getTimestamp: () => {
    return firebase.firestore.Timestamp.now()
  }
}

export default fireDb
