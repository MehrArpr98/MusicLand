import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCtnXAlW36x8hZvJ8T2lP8Hep1-Kq66sJw',
  authDomain: 'music-84262.firebaseapp.com',
  projectId: 'music-84262',
  storageBucket: 'music-84262.appspot.com',
  /*  messagingSenderId: "577832410296", */
  appId: '1:577832410296:web:4d0530527445585d20a84d'
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')
const staticImgsCollection = db.collection('staticImages')

const storage = firebase.storage()

export { auth, usersCollection, songsCollection,storage , commentsCollection, staticImgsCollection}
