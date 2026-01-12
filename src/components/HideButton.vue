<script setup>
defineProps({
  showCompleted: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggle-show-completed"]);

function toggleShowCompleted() {
  emit("toggle-show-completed");
}
</script>

<template>
  <q-btn
    outline
    color="primary"
    :label="showCompleted ? 'Hide Completed' : 'Show Completed'"
    :icon="showCompleted ? 'visibility_off' : 'visibility'"
    @click="toggleShowCompleted"
    size="md"
  />
</template>
