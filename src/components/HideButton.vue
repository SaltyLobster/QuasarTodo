<script setup>

defineProps({
  showCompleted: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle-show-completed'])

function toggleShowCompleted() {
    emit('toggle-show-completed')
  }

</script>

<template>
  <q-btn class="button" @click="toggleShowCompleted">
    <span v-if="showCompleted">Hide completed</span>
    <span v-else>Show completed</span>
  </q-btn>
</template>
