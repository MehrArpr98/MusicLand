<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700 border-t">
    <nav class="container mx-auto flex justify-start items-center py-2 px-4">
      <!-- App Name -->
      <router-link
        class="text-white text-2xl mr-8 font-medium ease-in duration-300 font-mono text-3xl hover:font-bold hover:text-white"
        exact-active-class="no-active"
        :to="{ name: 'home'}"
      >
        <img :src="logoAddress" class="inline w-20" />
        <span>Music<span class="text-violet-300">Land</span>
        </span>
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1 text-white">
          <!-- Navigation Links -->
          <li>
            <router-link
              class="px-2 mx-2 hover:text-violet-200"
              :to="{ name: 'about'}"
            >About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a
              class="px-2 hover:text-violet-200"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              <i class="fa fa-user mr-1"></i>Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link
                class="px-2 mx-2 hover:text-violet-200"
                :to="{ name: 'manage'}"
              >Manage</router-link>
            </li>
            <li>
              <a class="px-2 hover:text-violet-200" href="#" @click.prevent="signOut">
                <i class="fa fa-user mr-1"></i>Logout
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import helper from '@/includes/helper'

export default {
  name: 'AppHeader',
  data() {
    return {
      logoAddress: ''
    }
  },
  computed: {
    ...mapStores(useModalStore, useUserStore)
  },
  async created() {
    this.logoAddress = await helper.getStaticImage('logo.png')
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    signOut() {
      this.userStore.signOut()

      if (this.$route.name === 'manage') this.$router.push({ name: 'home' })
    }
  }
}
</script>