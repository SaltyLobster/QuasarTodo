<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add-task']);

const taskText = ref('');

function addTask() {
  if (taskText.value.trim() !== '') {
    emit('add-task', taskText.value.trim());
    taskText.value = '';
  }
}
</script>

<template>
  <div class="top-container">
    <div class="form__group field">
      <q-input
        v-model="taskText"
        @keyup.enter="addTask"
        type="input"
        placeholder="Start typing a task"
        name="taskInput"
        id="taskInput"
        filled
      />
    </div>
  </div>
</template>
