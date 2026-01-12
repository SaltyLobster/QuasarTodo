<script setup>
import { ref, watch, inject, computed, onMounted } from "vue";

import InputLine from "components/InputLine.vue";
import TaskList from "components/TaskList.vue";
import HideButton from "components/HideButton.vue";

let taskId = Date.now();
const showCompleted = ref(true);
const activeTimeouts = new Map();

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

// Auto-save tasks when list changes
watch(
  taskList,
  () => {
    saveLists();
  },
  { deep: true }
);

function addTask(taskText, reminder = null) {
  if (!currentList.value) return;

  currentList.value.tasks.push({
    id: taskId++,
    task: taskText,
    isCompleted: false,
    reminder: reminder,
  });
  saveLists();
  scheduleNotification(
    currentList.value.tasks[currentList.value.tasks.length - 1]
  );
}

function removeTask(taskId) {
  if (!currentList.value) return;

  // Clear timeout if exists
  if (activeTimeouts.has(taskId)) {
    clearTimeout(activeTimeouts.get(taskId));
    activeTimeouts.delete(taskId);
  }

  currentList.value.tasks = currentList.value.tasks.filter(
    (task) => task.id !== taskId
  );
  saveLists();
}

function toggleCompleted(task) {
  task.isCompleted = !task.isCompleted;
  saveLists();
}

function toggleShowCompleted() {
  showCompleted.value = !showCompleted.value;
}

function editTaskReminder(taskId, reminder) {
  if (!currentList.value) return;

  const task = currentList.value.tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Clear old timeout
  if (activeTimeouts.has(taskId)) {
    clearTimeout(activeTimeouts.get(taskId));
    activeTimeouts.delete(taskId);
  }

  task.reminder = reminder;
  saveLists();
  scheduleNotification(task);
}

function scheduleNotification(task) {
  if (!task.reminder?.date || !task.reminder?.time) return;

  const reminderDateTime = new Date(
    `${task.reminder.date}T${task.reminder.time}`
  );
  const delay = reminderDateTime.getTime() - Date.now();

  if (delay > 0) {
    const timeoutId = setTimeout(() => {
      sendNotification(task);
      activeTimeouts.delete(task.id);
    }, delay);

    activeTimeouts.set(task.id, timeoutId);
  }
}

function sendNotification(task) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Task Reminder", {
      body: task.task,
      icon: "/icons/favicon.ico",
      tag: `task-${task.id}`,
      requireInteraction: true,
    });
  }
}

function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    rescheduleAllNotifications();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        rescheduleAllNotifications();
      }
    });
  }
}

function rescheduleAllNotifications() {
  if (!taskLists.value) return;

  taskLists.value.forEach((list) => {
    list.tasks.forEach((task) => {
      if (task.reminder && !task.isCompleted) {
        scheduleNotification(task);
      }
    });
  });
}

// Initialize notifications on mount
onMounted(() => {
  requestNotificationPermission();
});
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
            @edit-task-reminder="editTaskReminder"
          />
        </div>

        <!-- Show/Hide Completed -->
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
