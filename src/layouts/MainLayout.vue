<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Todo App</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      elevated
      :width="250"
      :breakpoint="1024"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">My Lists</div>

          <!-- Create New List -->
          <q-btn
            outline
            color="primary"
            label="New List"
            icon="add"
            class="full-width q-mb-md"
            @click="showCreateDialog = true"
          />

          <!-- List Items -->
          <q-list separator>
            <q-item
              v-for="list in taskLists"
              :key="list.id"
              clickable
              @click="selectList(list.id)"
              :active="selectedListId === list.id"
              active-class="bg-primary text-white"
              class="q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ list.name }}</q-item-label>
                <q-item-label caption
                  >{{ list.tasks.length }} tasks</q-item-label
                >
              </q-item-section>
              <q-item-section side top>
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click.stop="deleteList(list.id)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Create List Dialog -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create New List</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newListName"
            label="List Name"
            outlined
            dense
            @keyup.enter="createNewList"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Create"
            color="primary"
            @click="createNewList"
            :disable="newListName.trim() === ''"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, provide } from "vue";

defineOptions({
  name: "MainLayout",
});

const STORAGE_KEY = "taskLists";
const leftDrawerOpen = ref(false);
const showCreateDialog = ref(false);
const newListName = ref("");

// Initialize lists from localStorage
const taskLists = ref(initializeLists());
const selectedListId = ref(
  taskLists.value.length > 0 ? taskLists.value[0].id : null
);

function initializeLists() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  // Create default list on first load
  const defaultList = {
    id: Date.now(),
    name: "My Tasks",
    tasks: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultList]));
  return [defaultList];
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function selectList(listId) {
  selectedListId.value = listId;
}

function deleteList(listId) {
  const index = taskLists.value.findIndex((list) => list.id === listId);
  if (index > -1) {
    taskLists.value.splice(index, 1);
    if (selectedListId.value === listId) {
      selectedListId.value =
        taskLists.value.length > 0 ? taskLists.value[0].id : null;
    }
    saveLists();
  }
}

function createNewList() {
  if (!newListName.value.trim()) return;

  taskLists.value.push({
    id: Date.now(),
    name: newListName.value.trim(),
    tasks: [],
  });
  selectedListId.value = taskLists.value[taskLists.value.length - 1].id;
  newListName.value = "";
  showCreateDialog.value = false;
  saveLists();
}

function saveLists() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskLists.value));
}

// Provide to child components
provide("taskLists", taskLists);
provide("selectedListId", selectedListId);
provide("saveLists", saveLists);
</script>
