<script setup>
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';


let id = 0

const showCompleted = ref(true)
const taskText = ref('')
const taskList = ref([])

const $q = useQuasar()

const savedList = $q.localStorage.getItem('taskList');
taskList.value = savedList ? JSON.parse(savedList) : [];

watch(taskList, (newTaskList) => {
  $q.localStorage.set('taskList', JSON.stringify(newTaskList));
}, { deep: true });

const isTaskListEmpty = computed(() => taskList.value.length === 0);

const filteredTasks = computed(() => {
  return showCompleted.value
    ? taskList.value
    : taskList.value.filter(task => !task.isCompleted);
});

function addTask() {
  if (taskText.value.trim() !== '') {
    taskList.value.push({
      id: id++,
      task: taskText.value,
      isCompleted: false
    });
    taskText.value = '';
  } else {
    $q.notify({
      type: 'negative',
      message: 'Task cannot be empty!',
    });
  }
}

function removeTask(taskId) {
    taskList.value = taskList.value.filter(task => task.id != taskId)
  }

function toggleCompleted(task) {
    task.isCompleted = !task.isCompleted
  }

function toggleShowCompleted() {
    showCompleted.value = !showCompleted.value
  }


</script>

<template>
  <q-page class="body">
    <div class="top-container">
      <div class="form__group field">
        <q-input
          v-model="taskText"
          @keyup.enter="addTask"
          type="input"
          placeholder="Start typing a task"
          name="name"
          id='name'
          filled
          />
      </div>

        <!-- Show message if task list is empty -->
      <h3 v-if="isTaskListEmpty">Start adding tasks</h3>

        <q-list v-else class="task-list" separator>
          <q-item
          v-for="task in filteredTasks"
          clickable
          :key="task.id"
          :class="{ completed: task.isCompleted }"
          @click="toggleCompleted(task)">
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

        <q-btn class="button" @click="toggleShowCompleted">
          <span v-if="showCompleted==true">Hide completed</span>
          <span v-else>Show completed</span>
        </q-btn>
      </div>
  </q-page>
</template>input

<style scoped>

</style>
