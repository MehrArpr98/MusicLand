<template>
  <div class="border border-gray-500 p-3 py-5 mb-4 rounded">
    <div v-show="!showForm">
      <img :src="song.img_url" class="float-left h-7 mr-2" />
      <router-link
        :to="{ name: 'song', params:{ id: song.docID}}"
        class="inline-block text-sm md:text-xl text-gray-300 hover:font-bold hover:text-white w-1/2"
      >{{ song.modified_name }}</router-link>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white border-b border-l border-red-600 float-right transition duration-100 hover:bg-red-600"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white border-b border-l border-cyan-600 float-right transition duration-100 hover:bg-cyan-600"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white border-b border-l border-yellow-600 float-right transition duration-100 hover:bg-yellow-600"
        @change.prevent="uploadImage($event)"
      >
        <label class="cursor-pointer">
          <input type="file" id="img" />
          <i class="fa fa-image"></i>
        </label>
      </button>

      <div class="float-none md:float-right w-1/2 md:w-1/5 mt-6 md:my-1.5" v-show="uploadImg.current_progress > 0">
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="uploadImg.variant"
            :style="{width: uploadImg.current_progress + '%'}"
          ></div>
        </div>
      </div>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold rounded p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >{{ alert_message }}</div>
      <vee-form :validation-schema="validForm" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block text-white mb-2">Song Title</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            name="modified_name"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-500 block" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block text-white mb-2">Genre</label>
          <vee-field
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            name="gener"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-500 block" name="gener" />
        </div>

        <button
          type="submit"
          class="py-1.5 px-3 mr-1.5 rounded text-white bg-green-600"
          :disabled="in_submission"
        >Submit</button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission"
          @click.prevent="showForm = false"
        >Go Back</button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { storage, songsCollection, imgsCollection, auth } from '@/includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function,
      required: true
    },
    updateSongImg: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      validForm: {
        modified_name: 'required',
        gener: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info.',
      uploadImg: {
        current_progress: 0,
        variant: 'bg-blue-400'
      }
    }
  },
  methods: {
    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! Updating song info.'

      console.log('values:',values)
      try {
        await songsCollection.doc(this.song.docID).update({'modified_name':values.modified_name , 'gener': values.gener})
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Please try later.'
        return
      }
      this.updateSong(this.index, values)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!!'
      this.updateUnsavedFlag(false)
      setTimeout(() => {
        this.show_alert = false
        this.showForm = false
      }, 3000)
    },
    async deleteSong() {
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.original_name}`)
      await songRef.delete()

      await songsCollection.doc(this.song.docID).delete()
      this.removeSong(this.index)
    },
    uploadImage(e) {
      const files = [...e.target.files]
      files.forEach((file) => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
          return
        }

        const storageRef = storage.ref()
        const imgsRef = storageRef.child(`images/${file.name}`)
        const task = imgsRef.put(file)

        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.uploadImg.current_progress = progress
          },
          (error) => {
            console.log(error)
          },
          async () => {
            this.uploadImg.variant = 'bg-green-400'

            const img = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              sid: this.song.docID
            }
            img.url = await task.snapshot.ref.getDownloadURL()

            await imgsCollection.add(img)
            await songsCollection.doc(this.song.docID).update('img_url', img.url)

            this.updateSongImg(this.index, img.url)

            setTimeout(() => {
              this.uploadImg.current_progress = 0
            }, 3000)
          }
        )
      })
    }
  }
}
</script>
