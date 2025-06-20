<template>
  <main class="cursor-auto text-sm text-gray-800 mt-5">
    <div class="flex flex-col gap-4 p-4 m-5 rounded-md bg-white">
      <div class="flex justify-between items-center border-b border-black p-4">
        <div>
          <div class="font-bold">Course name</div>
          <div>Exam type</div>
        </div>
        <div>
          <div><span class="font-bold">Pass rate</span> 100% (30/30)</div>
          <div><span class="font-bold">Average grade</span> 100</div>
        </div>
      </div>

      <div class="flex justify-end">
        <div
          class="flex gap-4 border border-gray-400 px-4 py-2 rounded-md items-center justify-center"
        >
          <label for="search">Search</label>
          <input
            type="text"
            class="border-b border-gray-400 focus:outline-1 focus:outline-gray-400"
            id="search"
            placeholder="type here..."
          />
          <label for="search">Show</label>
          <select
            class="focus:outline-none focus:ring-0 focus:shadow-none border border-gray-400 rounded-sm px-2 py-1"
            id="filter-select"
          >
            <option>All</option>
            <option>Passed</option>
            <option>Failed</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div class="flex gap-4 p-4 border border-red-400 rounded-sm cursor-pointer justify-between">
          <div class="font-semibold">Student name</div>
          <div class="text-red-700">90</div>
        </div>
        <div
          class="flex gap-4 p-4 border border-emerald-400 rounded-sm cursor-pointer justify-between"
        >
          <div class="font-semibold">Student name</div>
          <div class="text-emerald-700">90</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
