import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TaskList from "../components/TaskList.vue";

describe("TaskList.vue", () => {
  let wrapper;
  const mockTasks = [
    { id: 1, task: "Test Task 1", isCompleted: false, reminder: null },
    { id: 2, task: "Test Task 2", isCompleted: true, reminder: null },
    {
      id: 3,
      task: "Test Task 3",
      isCompleted: false,
      reminder: { date: "2026-01-15", time: "14:30" },
    },
  ];

  beforeEach(() => {
    wrapper = mount(TaskList, {
      props: {
        tasks: mockTasks,
        showCompleted: true,
      },
      global: {
        stubs: {
          "q-card": true,
          "q-list": true,
          "q-item": true,
          "q-item-section": true,
          "q-item-label": true,
          "q-checkbox": true,
          "q-btn": true,
          "q-icon": true,
          "q-dialog": true,
          "q-card-section": true,
          "q-card-actions": true,
          "q-input": true,
          TimePickerScroll: true,
        },
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays all tasks when showCompleted is true", () => {
    expect(wrapper.vm.filteredTasks).toHaveLength(3);
  });

  it("filters out completed tasks when showCompleted is false", async () => {
    await wrapper.setProps({ showCompleted: false });
    expect(wrapper.vm.filteredTasks).toHaveLength(2);
  });

  it("shows empty state when no tasks exist", async () => {
    await wrapper.setProps({ tasks: [] });
    expect(wrapper.vm.isTaskListEmpty).toBe(true);
  });

  it("emits remove-task event when delete button is clicked", () => {
    wrapper.vm.removeTask(1);
    expect(wrapper.emitted("remove-task")).toBeTruthy();
    expect(wrapper.emitted("remove-task")[0]).toEqual([1]);
  });

  it("emits toggle-task event when checkbox is toggled", () => {
    const task = mockTasks[0];
    wrapper.vm.toggleCompleted(task);
    expect(wrapper.emitted("toggle-task")).toBeTruthy();
    expect(wrapper.emitted("toggle-task")[0]).toEqual([task]);
  });

  it("formats date and time correctly", () => {
    const formatted = wrapper.vm.formatDateTime("2026-01-15", "14:30");
    expect(formatted).toContain("Jan");
    expect(formatted).toContain("15");
    expect(formatted).toContain("2:30 PM");
  });

  it("handles null date/time gracefully", () => {
    const formatted = wrapper.vm.formatDateTime(null, null);
    expect(formatted).toBeNull();
  });

  it("opens edit reminder dialog with task data", () => {
    const task = mockTasks[0];
    wrapper.vm.openEditReminder(task);

    expect(wrapper.vm.editingTask).toEqual(task);
    expect(wrapper.vm.showEditDialog).toBe(true);
  });

  it("saves reminder with new date and time", () => {
    const task = mockTasks[0];
    wrapper.vm.editingTask = task;
    wrapper.vm.editDate = "2026-01-20";
    wrapper.vm.editTime = "10:00";

    wrapper.vm.saveReminder();

    expect(wrapper.emitted("edit-task-reminder")).toBeTruthy();
    expect(wrapper.emitted("edit-task-reminder")[0]).toEqual([
      task.id,
      { date: "2026-01-20", time: "10:00" },
    ]);
  });

  it("removes reminder when removeReminder is called", () => {
    wrapper.vm.removeReminder(3);
    expect(wrapper.emitted("edit-task-reminder")).toBeTruthy();
    expect(wrapper.emitted("edit-task-reminder")[0]).toEqual([3, null]);
  });
});
