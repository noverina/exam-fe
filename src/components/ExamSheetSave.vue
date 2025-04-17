<template>
  <div class="flex gap-2 p-2 text-sm justify-between">
    <button class="rounded-full py-2 px-4 cursor-pointer bg-yellow-200">save</button>
    <button class="rounded-full py-2 px-4 cursor-pointer bg-yellow-200">submit</button>
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: 'ExamSheetSave',
})

interface Props {
  examId: number
}
defineProps<Props>()
</script>
