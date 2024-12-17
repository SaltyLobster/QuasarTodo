<script setup>
import { computed } from 'vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  showCompleted: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle-task', 'remove-task', 'toggle-show-completed']);

const isTaskListEmpty = computed(() => props.tasks.length === 0);

const filteredTasks = computed(() => {
  return props.showCompleted
    ? props.tasks
    : props.tasks.filter(task => !task.isCompleted);
});

function removeTask(taskId) {
  emit('remove-task', taskId);
}

function toggleCompleted(task) {
  emit('toggle-task', task);
}
</script>

<template>
  <h3 v-if="isTaskListEmpty">Start adding tasks</h3>

  <q-list v-else class="task-list" separator>
    <q-item
      v-for="task in filteredTasks"
      :key="task.id"
      clickable
      @click="toggleCompleted(task)"
      :class="{ completed: task.isCompleted }"
    >
      <span>{{ task.task }}</span>
      <q-btn
        flat
        dense
        icon="close"
        color="warning"
        @click.stop="removeTask(task.id)"
      />
    </q-item>
  </q-list>
</template>
