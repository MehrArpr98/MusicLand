
<template>
  <div>
    <app-header />

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" class="mt-16 md:mt-24"></component>
      </transition>    
    </router-view>
    
    <app-player v-if="sound.playing"/>

    <auth />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue'
import Auth from './components/Auth.vue'
import AppPlayer from './components/Player.vue'
import { mapWritableState, mapState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from './includes/firebase'
import ussPlayerStore from './stores/player.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    Auth,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
    ...mapState(ussPlayerStore,['sound'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
<style>
.fade-enter-from{
  opacity: 0;
}
.fade-enter-active{
transition: all .5s linear;
}

.fade-leave-to{
  transition: all .5s linear;
  opacity: 0;
}
</style>

