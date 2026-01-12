<script setup>
import { ref } from "vue";

const emit = defineEmits(["add-task"]);

const taskText = ref("");

function addTask() {
  if (taskText.value.trim() !== "") {
    emit("add-task", taskText.value.trim());
    taskText.value = "";
  }
}
</script>

<template>
  <div class="q-gutter-md">
    <q-input
      v-model="taskText"
      @keyup.enter="addTask"
      outlined
      type="text"
      placeholder="Add a new task..."
      label="Task"
      dense
      class="full-width"
    >
      <template v-slot:prepend>
        <q-icon name="edit" />
      </template>
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          icon="add"
          color="primary"
          @click="addTask"
          :disable="taskText.trim() === ''"
        />
      </template>
    </q-input>
  </div>
</template>
