<script setup>
import { ref, computed } from 'vue'


class TaskList {
  constructor(name) {
    this.name = name
    this.tasks = ref([])
    this.idCounter = 0
  }
}


let id = 0

const showCompleted = ref(true)
const taskText = ref('')
const taskList = ref([
  {
    id: id++,
    task: "Learn JS",
    isCompleted: false
  },
  {
    id: id++,
    task: "Learn Quasar",
    isCompleted: false
  },
  {
    id: id++,
    task: "Learn Vue",
    isCompleted: true
  },
])

const taskLists = ref([
  new TaskList("Work"),
  new TaskList("Personal"),
  new TaskList("Hobbies"),
]);

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
        taskText.value = ''
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
        <q-list class="task-list" separator>
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
