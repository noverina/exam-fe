<template>
  <div
    class="flex flex-col gap-4 fixed inset-0 bg-white z-99 flex flex-col gap-4 items-center justify-center"
  >
    <svg
      class="w-8 h-8 animate-spin spinner text-gray-300"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <div class="text-gray-300 dots">Loading</div>
  </div>
</template>

<style scoped>
.dots::after {
  content: '';
  animation: dots 1s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...';
  }
  100% {
    content: '';
  }
}
</style>
