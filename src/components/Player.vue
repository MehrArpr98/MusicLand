<template>
  <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full z-100">
    <!-- Track Info -->
    <button
      @click.prevent="stopPlaying(song)"
      type="button"
      class="z-50 h-8 w-8 bg-red-700 text-white rounded-full focus:outline-none absolute right-4 -top-4"
    >
      <i class="fas fa-times"></i>
    </button>
    <div class="text-center" v-if="current_song.modified_name">
      <span class="song-title font-bold">{{ current_song.modified_name }}</span> by
      <span class="song-artist">{{ current_song.display_name }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleAudio">
        <i class="fa text-gray-500 text-xl" :class=" {'fa-play' : !playing, 'fa-pause' : playing}"></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{left: playerProgress}"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-violet-400 to-violet-300"
          :style="{ width: playerProgress}"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import usePlayerStor from '@/stores/player'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'Player',
  computed: {
    ...mapState(usePlayerStor, ['playing', 'duration', 'seek', 'playerProgress', 'current_song'])
  },
  methods: {
    ...mapActions(usePlayerStor, ['toggleAudio', 'updateSeek', 'stopPlaying'])
  }
}
</script>
