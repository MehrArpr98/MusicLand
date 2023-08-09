<template>
  <!-- Main Content -->
  <section class="p-5 container mx-auto mt-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="mt-8 md:mt-0 col-span-2">
        <div class="relative flex flex-col">
          <div
            class="py-5 font-bold text-2xl items-center text-white justify-end flex flex-row-reverse"
            v-icon="'compact-disc'"
          >
            <span class="card-title">My Songs</span>
            <!-- Icon -->
          </div>
          <div class>
            <!-- Composition Items -->
            <composition-item
              v-for="(song,i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :updateSongImg="updateSongImg"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import useUserStore from '@/stores/user'
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { auth, songsCollection } from '@/includes/firebase'

export default {
  name: 'manage',
  components: { AppUpload, CompositionItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].gener = values.gener
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id
      }
      this.songs.push(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    },
    updateSongImg(i, imgUrl) {
      this.songs[i].img_url = imgUrl
    }
  },
  beforeRouteEnter(to, from, next) {
    const store = useUserStore()
    if (store.userLoggedIn) {
      next()
    } else {
      next({ name: 'home' })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
      next(leave)
    }
  },
  async created() {
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    snapshot.forEach(this.addSong)
  }
  /* beforeRouteLeave(to, from, next) {
    this.$refs.upload.cancelUpload()
    next()
  } */
}
</script>