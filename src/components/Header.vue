<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700 z-50 h-16 md:h-24 fixed left-0 right-0 top-0">
    <nav class="container mx-auto py-2">
      <div class="px-4 w-full">
        <div class="flex justify-between">
          <div class="flex space-x-7">
            <div>
              <!-- Website Logo -->
              <router-link
                class="text-white text-l md:text-3xl mr-8 font-medium ease-in duration-300 font-mono hover:font-bold hover:text-white"
                exact-active-class="no-active"
                :to="{ name: 'home' }"
              >
                <img :src="logoAddress" class="inline w-12 md:w-20" />
                <span>Music<span class="text-violet-300">Land</span></span>
              </router-link>
            </div>

            <div class="hiddenflex flex-grow items-center hidden md:flex">
              <!-- Primary Navigation -->
              <ul class="flex flex-row mt-1 text-white">
                <!-- Navigation Links -->
                <li>
                  <router-link class="px-2 mx-2 hover:text-violet-200" :to="{ name: 'about' }"
                    >About</router-link
                  >
                </li>
                <li v-if="!userStore.userLoggedIn">
                  <a class="px-2 hover:text-violet-200" href="#" @click.prevent="toggleAuthModal">
                    <i class="fa fa-user mr-1"></i>Login / Register
                  </a>
                </li>
                <template v-else>
                  <li>
                    <router-link class="px-2 mx-2 hover:text-violet-200" :to="{ name: 'manage' }"
                      >Manage</router-link
                    >
                  </li>
                  <li>
                    <a class="px-2 hover:text-violet-200" href="#" @click.prevent="signOut">
                      <i class="fa fa-user mr-1"></i>Logout
                    </a>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button class="outline-none mobile-menu-button" @click="toggleMenu">
              <i
                class="fa w-6 h-6 text-gray-500"
                :class="[isOpenMenu ? 'fa-times' : 'fa-bars']"
              ></i>
            </button>
          </div>
        </div>
      </div>
      <!-- mobile menu -->
      <div class="bg-gray-700 md:hidden mobile-menu px-4 z-50" :class="hiddenClass">
        <ul class="pt-5 text-white">
          <li>
            <router-link class="block text-sm px-2 py-4" :to="{ name: 'about' }">About</router-link>
          </li>

          <li v-if="!userStore.userLoggedIn">
            <a class="block text-sm px-2 py-4" href="#" @click.prevent="toggleAuthModal">
              <i class="fa fa-user mr-1"></i>Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="block text-sm px-2 py-4" :to="{ name: 'manage' }"
                >Manage</router-link
              >
            </li>
            <li>
              <a class="block text-sm px-2 py-4" href="#" @click.prevent="signOut">
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
import { mapStores, mapState } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'
import useMobileStore from '@/stores/mobile'
import helper from '@/includes/helper'

export default {
  name: 'AppHeader',
  data() {
    return {
      logoAddress: ''
    }
  },
  computed: {
    ...mapStores(useModalStore, useUserStore, useMobileStore),
    ...mapState(useMobileStore, ['hiddenClass', 'isOpenMenu'])
  },
  async created() {
    this.logoAddress = await helper.getStaticImage('logo.png')
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
    },
    toggleMenu() {
      this.mobileStore.isOpenMenu = !this.mobileStore.isOpenMenu
    },
    signOut() {
      this.userStore.signOut()

      if (this.$route.name === 'manage') this.$router.push({ name: 'home' })
    }
  }
}
</script>
