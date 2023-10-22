
<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url('../assets/img/header.png')"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Make your first playlist in less than a minute. 
            Playlist was built to give you the power to make the perfect mix for any moment, right when you need it.
            Stop endlessly scrolling for music.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="../assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto p-5">
      <div class="bg-gray-800 relative flex flex-col ">
        <div class="px-6 pt-6 pb-5 font-bold text-2xl items-center text-white justify-center flex flex-row-reverse" v-icon="'headphones-alt'">
          <span class="card-title">Songs</span>
          <!-- Icon -->         
        </div>
        <!-- Playlist -->
        <ol id="playlist" class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-10  ">
          <app-song-item v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>
<script>
import { songsCollection } from '@/includes/firebase'
import AppSongItem from '@/components/SongItem.vue'
import helper from '@/includes/helper'

export default {
  components: {
    AppSongItem
  },
  data() {
    return {
      songs: [],
      maxPerPage: 6,
      pendingRequest: false,
      introductionmusicAddress:'',
      headerAddress:''
    }
  },
  beforeCreate() {
    window.addEventListener('scroll', this.getSongs)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.getSongs)
  },
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)

    this.headerAddress = await helper.getStaticImage('header.png')
    this.introductionmusicAddress = await helper.getStaticImage('introduction-music.png')
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        this.getSongs()
      }
    },
    async getSongs() {
      if (this.pendingRequest) return;

      this.pendingRequest = true;

      let snapshot;
      if (this.songs.length) {
        const lastDoc = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get();
        snapshot = await songsCollection
        .orderBy('modified_name')
        .startAfter(lastDoc)
        .limit(this.maxPerPage)
        .get()
        snapshot.forEach((document) => {
          this.songs.push({
            docID: document.id,
            ...document.data()
          })
        })
      } else {
        snapshot = await songsCollection
        .orderBy('modified_name')
        .limit(this.maxPerPage)
        .get()
        snapshot.forEach((document) => {
          this.songs.push({
            docID: document.id,
            ...document.data()
          })
        })
      }

      this.pendingRequest = false
    }
  }
}
</script>
