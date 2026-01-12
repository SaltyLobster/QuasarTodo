<script setup>
import { ref } from "vue";
import TimePickerScroll from "./TimePickerScroll.vue";

const emit = defineEmits(["add-task"]);

const taskText = ref("");
const showDateTimeDialog = ref(false);
const selectedDate = ref("");
const selectedTime = ref("");

function addTask() {
  if (taskText.value.trim() !== "") {
    if (selectedDate.value && selectedTime.value) {
      emit("add-task", taskText.value.trim(), {
        date: selectedDate.value,
        time: selectedTime.value,
      });
    } else {
      emit("add-task", taskText.value.trim(), null);
    }
    taskText.value = "";
    selectedDate.value = "";
    selectedTime.value = "";
    showDateTimeDialog.value = false;
  }
}

function openDateTimeDialog() {
  showDateTimeDialog.value = true;
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
          icon="schedule"
          color="info"
          @click="openDateTimeDialog"
          class="q-mr-xs"
        />
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

    <!-- Date/Time Dialog -->
    <q-dialog v-model="showDateTimeDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Set Reminder</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="selectedDate"
            type="date"
            label="Date"
            outlined
            dense
          />
          <TimePickerScroll v-model="selectedTime" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Set" color="primary" @click="addTask" />
          <q-btn
            flat
            label="Skip"
            color="grey"
            v-close-popup
            @click="addTask"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
