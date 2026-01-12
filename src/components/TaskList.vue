<script setup>
import { computed } from "vue";

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  showCompleted: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "toggle-task",
  "remove-task",
  "toggle-show-completed",
]);

const isTaskListEmpty = computed(() => props.tasks.length === 0);

const filteredTasks = computed(() => {
  return props.showCompleted
    ? props.tasks
    : props.tasks.filter((task) => !task.isCompleted);
});

function removeTask(taskId) {
  emit("remove-task", taskId);
}

function toggleCompleted(task) {
  emit("toggle-task", task);
}
</script>

<template>
  <div v-if="isTaskListEmpty" class="text-center q-pa-md">
    <q-icon name="inbox" size="64px" color="grey-5" class="q-mb-md" />
    <p class="text-h6 text-grey-7">Start adding tasks</p>
  </div>

  <q-card v-else flat bordered class="shadow-1">
    <q-list separator>
      <q-item
        v-for="task in filteredTasks"
        :key="task.id"
        clickable
        @click="toggleCompleted(task)"
        :class="{ 'bg-grey-2': task.isCompleted }"
      >
        <q-item-section avatar>
          <q-checkbox
            :model-value="task.isCompleted"
            @update:model-value="toggleCompleted(task)"
            color="primary"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label
            :class="{ 'text-strikethrough text-grey-6': task.isCompleted }"
          >
            {{ task.task }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="negative"
            size="sm"
            @click.stop="removeTask(task.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
