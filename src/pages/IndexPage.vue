<script setup>
import { ref, watch, inject, computed } from "vue";
import { useQuasar } from "quasar";

import InputLine from "components/InputLine.vue";
import TaskList from "components/TaskList.vue";
import HideButton from "components/HideButton.vue";

let id = Date.now();
const showCompleted = ref(true);
const $q = useQuasar();

// Inject data from MainLayout
const taskLists = inject("taskLists");
const selectedListId = inject("selectedListId");
const saveLists = inject("saveLists");

// Get current list based on selection
const currentList = computed(() => {
  return taskLists.value.find((list) => list.id === selectedListId.value);
});

const taskList = computed(() => {
  return currentList.value ? currentList.value.tasks : [];
});

watch(
  taskList,
  () => {
    saveLists();
  },
  { deep: true }
);

function addTask(taskText) {
  if (currentList.value) {
    currentList.value.tasks.push({
      id: id++,
      task: taskText,
      isCompleted: false,
    });
    saveLists();
  }
}

function removeTask(taskId) {
  if (currentList.value) {
    currentList.value.tasks = currentList.value.tasks.filter(
      (task) => task.id !== taskId
    );
    saveLists();
  }
}

function toggleCompleted(task) {
  task.isCompleted = !task.isCompleted;
  saveLists();
}

function toggleShowCompleted() {
  showCompleted.value = !showCompleted.value;
}
</script>

<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-xs-12 col-sm-8 col-md-6">
        <!-- List Title -->
        <div class="q-mb-lg">
          <h5 class="q-my-none text-primary">{{ currentList?.name }}</h5>
        </div>

        <!-- Input Section -->
        <div class="q-mb-lg">
          <InputLine @add-task="addTask" />
        </div>

        <!-- Task List Section -->
        <div class="q-mb-md">
          <TaskList
            :tasks="taskList"
            :showCompleted="showCompleted"
            @toggle-task="toggleCompleted"
            @remove-task="removeTask"
          />
        </div>

        <!-- Action Button -->
        <div class="row justify-center">
          <HideButton
            :showCompleted="showCompleted"
            @toggle-show-completed="toggleShowCompleted"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>
