<template>
  <div>
    <div
      class="text-white text-center font-bold rounded p-4 mb-4"
      :class="login_alert_variant"
      v-if="login_show_alert"
    >{{ login_alert_text }}</div>
    <!-- Login Form -->
    <vee-form :validation-schema="loginSchema" @submit="login">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          name="email"
          type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email"
        />
        <ErrorMessage class="text-red-500" name="email" />
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          name="password"
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>
      <button
        type="submit"
        class="block w-full bg-green-600 text-white py-1.5 px-3 rounded transition hover:bg-green-700"
        :disabled="login_in_submission"
      >Submit</button>
    </vee-form>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:9|max:100'
      },
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_text: 'Please wait! We are logging you in.',
      login_in_submission: false
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    async login(values) {
      this.login_show_alert = true
      this.login_in_submission = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_text = 'Please wait! We are logging you in.'

      try {
        await this.authenticate(values)
      } catch (error) {
        this.login_in_submission = false
        this.login_alert_variant = 'bg-red-500'
        this.login_alert_text = 'Invalid login'
      }

      this.login_alert_variant = 'bg-green-500'
      this.login_alert_text = 'Success! You are logged in'

      window.location.reload()
    }
  }
}
</script>