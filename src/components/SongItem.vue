<template>
  <li class="cursor-pointer transition duration-300 text-gray-400 hover:text-white">
    <router-link
      :to="{ name: 'song', params:{ id: song.docID}}"
      class="font-bold block hover:text-white"
    >
      <div class="overflow-hidden">
        <img :src="song.img_url" class="w-full h-auto transition duration-700 hover:scale-110" />
      </div>
      <div class="w-full pt-2">
        <div class="truncate text-l md:text-2xl">{{ song.modified_name }}</div>
        <div class="flex justify-between items-center pt-1 text-gray-600 text-sm md:text-lg ">
          <span>{{ song.display_name }}</span>
          <div>
            <span class="comments" @click="navigate">
              <i class="fa fa-comments text-gray-600"></i>
              {{ song.comment_count}}
            </span>
          </div>
        </div>
      </div>
    </router-link>

    <!-- <div class="flex justify-between items-center pt-4">
      <div class="w-5/6">
        <router-link
          :to="{ name: 'song', params:{ id: song.docID}}"
          class="font-bold block text-2xl  truncate "
        >{{ song.modified_name }}</router-link>
        <span class="text-gray-600 text-lg">{{ song.display_name }}</span>
      </div>
     
      <div class="text-gray-600 text-lg w-2/12">
        <router-link
          custom
          :to="{ name: 'song', params:{ id: song.docID}, hash:'#comments'}"
          v-slot="{navigate}"
        >
          <span class="comments" @click="navigate">
            <i class="fa fa-comments text-gray-600"></i>
            {{ song.comment_count}}
          </span>
        </router-link>
      </div>
    </div> -->
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    song: Object
  }
}
</script>
