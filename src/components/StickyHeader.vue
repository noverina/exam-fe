<template>
  <nav
    id="header"
    class="bg-white flex justify-between px-8 py-3 h-12 sticky top-0 z-50 border border-gray-300"
  >
    <div class="flex gap-4">
      <router-link to="/" class="material-symbols-outlined">home</router-link>
      <router-link to="/test">test</router-link>
    </div>
    <div>User</div>
  </nav>
</template>
