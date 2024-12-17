<script setup>
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

import InputLine from 'components/InputLine.vue';
import TaskList from 'components/TaskList.vue';
import HideButton from 'components/HideButton.vue';


let id = Date.now();
const taskList = ref([]);
const showCompleted = ref(true);
const $q = useQuasar();


const savedList = $q.localStorage.getItem('taskList');
taskList.value = savedList ? JSON.parse(savedList) : [];


watch(taskList, (newTaskList) => {
  $q.localStorage.set('taskList', JSON.stringify(newTaskList));
}, { deep: true });


function addTask(taskText) {
  taskList.value.push({
    id: id++,
    task: taskText,
    isCompleted: false
  });
}

function removeTask(taskId) {
  taskList.value = taskList.value.filter(task => task.id !== taskId);
}

function toggleCompleted(task) {
  task.isCompleted = !task.isCompleted;
}

function toggleShowCompleted() {
  showCompleted.value = !showCompleted.value;
}
</script>

<template>
  <q-page class="body">

    <InputLine @add-task="addTask" />

    <TaskList
      :tasks="taskList"
      :showCompleted="showCompleted"
      @toggle-task="toggleCompleted"
      @remove-task="removeTask"
    />

    <HideButton
      :showCompleted="showCompleted"
      @toggle-show-completed="toggleShowCompleted"
    />

  </q-page>
</template>input

<style scoped>

</style>
