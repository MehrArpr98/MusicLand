<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-cover md:bg-contain music-bg md:bg-repeat-x"
        :style="{backgroundImage: 'url('+songheaderAddress+')'}"
      ></div>
      <div class="px-5 container mx-auto flex items-center">
        <div class="z-10">
          <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-40 h-16 w-16 text-xl md:h-24 md:w-24 md:text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        </div>
        
        <div class="z-40 text-left ml-4 md:ml-8">
          <!-- Song Info -->
          <div class="text-xl md:text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.gener }}</div>
        </div>
      </div>
    </section>

    <section
      class="p-5 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10 container mx-auto mt-6"
      id="comments"
    >
      <div class="col-span-1">
        <img :src="song.img_url" class="w-full transition duration-700" />
      </div>
      <div class="mt-8 md:mt-0 text-white relative flex flex-col col-span-2">
        <div
          class="py-5 font-bold text-2xl items-center text-white flex flex-row-reverse justify-end"
        >
          <!-- Comment Count -->
          <span class="card-title">Comments ({{ song.comment_count}})</span>
          <i class="fa fa-comments text-green-600 text-xl mr-2"></i>
        </div>
        <div class>
          <!-- Form -->
          <div
            class="text-white text-center font-bold rounded p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >{{ comment_alert_message }}</div>
          <vee-form
            v-if="userLoggedIn"
            :validation-schema="schema"
            @submit="addComment"
            class="flex justify-between flex-col md:flex-row"
          >
            <div class="w-full md:w-2/3">
              <vee-field
                as="textarea"
                name="comment"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-2"
                placeholder="Your comment here..."
              ></vee-field>
              <ErrorMessage class="text-red-500 block" name="comment" />
            </div>

            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block h-12"
              :dissabled="comment_in_submission"
            >Submit comment</button>
          </vee-form>

          <!-- Sort Comments -->
          <!--  <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-300 border border-gray-300 bg-gray-700 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>-->

          <div class="block my-4 p-3 border border-gray-600 rounded">
            <span>Sort based on :</span>

            <label for="latest" class="mx-5" :class="{'text-violet-300' : sort === '1'}">Latest</label>
            <input class="hidden" id="latest" type="radio" name="sortDir" value="1" v-model="sort" />

            <label for="oldest" :class="{'text-violet-300' : sort === '2'}">oldest</label>
            <input class="hidden" id="oldest" type="radio" name="sortDir" value="2" v-model="sort" />
          </div>

          <!-- Comments -->
          <ul class="container mx-auto">
            <li
              class="p-5 border-b border-gray-600 text-gray-500"
              v-for="comment in sortedComments"
              :key="comment.docID"
            >
              <!-- Comment Author -->
              <div class="mb-3 flex justify-between flex-col md:flex-row">
                <div class="font-bold text-zinc-400 text-l">
                  <i class="fa fa-user mr-1"></i>
                  {{ comment.name }}
                </div>
                <time>{{ comment.formatDate }}</time>
              </div>

              <p class="text-white">{{ comment.content }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase'
import { ErrorMessage } from 'vee-validate'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'
import helper from '../includes/helper'

export default {
  name: 'Song',
  components: { ErrorMessage },
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      comments: [],
      sort: '1',
      songheaderAddress:''
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') return new Date(b.datePosted) - new Date(a.datePosted)
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) return
      this.$router.push({ query: { sort: newVal } })
    }
  },
  async created() {
    const { sort } = this.$route.query
    this.sort = sort === '1' || sort === '2' ? sort : '1'
    //if (this.$route.query.sort) this.sort = this.$route.query.sort

    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()
    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' })
      return
    }
    this.song = docSnapshot.data()
    this.getComments()

    this.songheaderAddress = await helper.getStaticImage('song-header.png')
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait! Your comment is being submitted.'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName
      }
      comment.formatDate = helper.formatDate(comment.datePosted)

      await commentsCollection.add(comment)

      this.song.comment_count += 1
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count
      })

      //this.comments.push(comment)
      this.getComments()

      this.comment_in_submission = false
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_message = 'Comment added!'

      resetForm()

      setTimeout(() => {
        this.comment_show_alert = false
      }, 3000)
    },
    async getComments() {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get()
      this.comments = []

      snapshots.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data()
        })
      })
    }
  }
}
</script>
