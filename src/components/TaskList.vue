<script setup>
import { ref, computed } from "vue";
import TimePickerScroll from "./TimePickerScroll.vue";

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

const emit = defineEmits(["toggle-task", "remove-task", "edit-task-reminder"]);

const showEditDialog = ref(false);
const editingTask = ref(null);
const editDate = ref("");
const editTime = ref("");

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

function openEditReminder(task) {
  editingTask.value = task;
  editDate.value = task.reminder?.date || "";
  editTime.value = task.reminder?.time || "";
  showEditDialog.value = true;
}

function saveReminder() {
  if (editingTask.value) {
    emit("edit-task-reminder", editingTask.value.id, {
      date: editDate.value,
      time: editTime.value,
    });
    showEditDialog.value = false;
  }
}

function removeReminder(taskId) {
  emit("edit-task-reminder", taskId, null);
}

function formatDateTime(date, time) {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
            @click="toggleCompleted(task)"
            class="cursor-pointer"
          >
            {{ task.task }}
          </q-item-label>
          <q-item-label v-if="task.reminder" caption class="text-info">
            <q-icon name="notifications" size="xs" class="q-mr-xs" />
            {{ formatDateTime(task.reminder.date, task.reminder.time) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="row no-wrap q-gutter-xs">
            <q-btn
              flat
              dense
              round
              icon="schedule"
              color="info"
              size="sm"
              @click.stop="openEditReminder(task)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              size="sm"
              @click.stop="removeTask(task.id)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <!-- Edit Reminder Dialog -->
  <q-dialog v-model="showEditDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Edit Reminder</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input v-model="editDate" type="date" label="Date" outlined dense />
        <TimePickerScroll v-model="editTime" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          v-if="editingTask?.reminder"
          flat
          label="Remove"
          color="negative"
          @click="
            removeReminder(editingTask.id);
            showEditDialog = false;
          "
        />
        <q-btn
          flat
          label="Save"
          color="primary"
          @click="saveReminder"
          :disable="!editDate || !editTime"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
