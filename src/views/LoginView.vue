<template>
  <div class="flex justify-center items-center h-screen w-full text-xs lg:text-sm text-gray-800">
    <ModalError ref="errorModal" :text="errorText" :code="statusCode" />
    <div v-show="loading">
      <LoadingSpinner />
    </div>
    <div
      v-show="!loading"
      class="border border-gray-300 rounded-sm overflow-auto bg-white p-10 w-10/12 lg:w-4/12 gap-10"
    >
      <form @submit.prevent="login" class="flex flex-col gap-6" novalidate>
        <div class="text-lg font-semibold">Portofolio - Exam App</div>
        <div class="flex flex-col gap-2 w-full">
          <label for="email">E-mail</label>
          <input
            type="email"
            name="email"
            class="border border-gray-400 rounded-sm px-2 py-1 focus:outline-1 focus:outline-gray-400"
            placeholder="Type here..."
            v-model="form.email"
          />
          <ErrorForm :show-condition="errors.get('email')"> {{ errors.get('email') }}</ErrorForm>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <label for="password">Password</label>
          <input
            type="password"
            name="password"
            class="border border-gray-400 rounded-sm px-2 py-1 focus:outline-1 focus:outline-gray-400"
            placeholder="Type here..."
            v-model="form.password"
          />
          <ErrorForm :show-condition="errors.get('password')">
            {{ errors.get('password') }}</ErrorForm
          >
        </div>
        <div class="flex flex-col gap-4 w-full">
          <ButtonYellow type="submit" :is-border="false">Login</ButtonYellow>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import ModalError from '@/components/ModalError.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { Auth } from '@/types/types'
import { ref } from 'vue'
import { handleError } from '@/utils/error'
import { useRouter } from 'vue-router'
import { originalFetch } from '@/main'
import { useAuthStore } from '@/stores/auth'
import ButtonYellow from '@/components/buttons/ButtonYellow.vue'
import ErrorForm from '@/components/ErrorForm.vue'

const errorModal = ref<InstanceType<typeof ModalError> | null>(null)

const errorText = ref('')
const statusCode = ref('')
const loading = ref(false)
const router = useRouter()

const form = ref<Auth>({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const errors = ref(new Map<string, string>())
const login = async () => {
  errors.value = validate(form.value)
  if (errors.value.size == 0) {
    loading.value = true
    try {
      await authStore.login(form.value, originalFetch)
      router.push({ name: 'HomeView' })
    } catch (err) {
      if (err instanceof Error) handleError(err, errorModal, statusCode)
    } finally {
      loading.value = false
    }
  }
}

const validate = (data: Auth): Map<string, string> => {
  errors.value.clear()
  const output = new Map<string, string>()
  if (!data.email?.trim()) output.set('email', 'Email must be filled')
  if (!data.password?.trim()) output.set('password', 'Password must be filled')
  return output
}
</script>
