<template>
  <div class="rounded border border-gray-500 relative flex flex-col">
    <div
      class="px-6 py-5 font-bold text-2xl items-center text-white justify-end flex flex-row-reverse"
      v-icon="'upload'"
    >
      <span class="card-title">Upload</span>
      <!-- Icon -->
    </div>

    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="hidden md:block w-full bg-gray-700 px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-violet-200 hover:border-violet-200 hover:border-solid"
        :class="{'bg-violet-400 border-violet-400 border-solid' : is_dragOver}"
        @dragenter.prevent.stop="is_dragOver = true"
        @dragend.prevent.stop="is_dragOver = false"
        @dragexit.prevent.stop
        @dragover.prevent.stop="is_dragOver = true"
        @dragleave.prevent.stop="is_dragOver = false"
        @dragstart.prevent.stop
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input class="text-white" type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <template v-if="upload.current_progress > 0">
          <!-- File Name -->
          <div class="text-gray-300 font-bold text-sm" :class="upload.text_class">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
              class="transition-all progress-bar"
              :class="upload.variant"
              :style="{width: upload.current_progress + '%'}"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'
import helper from '@/includes/helper'

export default {
  data() {
    return {
      is_dragOver: false,
      uploads: [],
      defaultmusicAddress: ''
    }
  },
  props: {
    addSong: {
      type: Function,
      required: true
    }
  },
  async created() {
    this.defaultmusicAddress = await helper.getStaticImage('defult-music.jpg')
  },
  methods: {
    upload($event) {
      this.is_dragOver = false

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return
        }

        const storageRef = storage.ref()
        const songsRef = storageRef.child(`songs/${file.name}`)
        const task = songsRef.put(file)

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            icon: 'fas fa-spinner fa-spin',
            variant: 'bg-blue-400',
            text_class: ''
          }) - 1

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploads[uploadIndex].current_progress = progress
          },
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'

            console.log(error)
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              gener: '',
              comment_count: 0,
              img_url: this.defaultmusicAddress
            }
            song.url = await task.snapshot.ref.getDownloadURL()

            const songRef = await songsCollection.add(song)
            const songSnapshot = await songRef.get()

            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'

            this.addSong(songSnapshot)

            setTimeout(() => {
              this.uploads[uploadIndex].current_progress = 0
            }, 3000)
          }
        )
      })
    }
    /* cancelUpload(){
      this.uploads.forEach((upload) => {
      upload.task.cancel();
    })
    } */
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => {
      upload.task.cancel()
    })
  }
}
</script>