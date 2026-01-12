import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputLine from "../components/InputLine.vue";

describe("InputLine.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(InputLine, {
      global: {
        stubs: {
          "q-input": true,
          "q-btn": true,
          "q-icon": true,
          "q-dialog": true,
          "q-card": true,
          "q-card-section": true,
          "q-card-actions": true,
          TimePickerScroll: true,
        },
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("emits add-task event when adding a task without reminder", async () => {
    const input = wrapper.vm;
    input.taskText = "Test Task";
    input.selectedDate = "";
    input.selectedTime = "";

    await input.addTask();

    expect(wrapper.emitted("add-task")).toBeTruthy();
    expect(wrapper.emitted("add-task")[0]).toEqual(["Test Task", null]);
  });

  it("emits add-task event with reminder when date and time are set", async () => {
    const input = wrapper.vm;
    input.taskText = "Test Task";
    input.selectedDate = "2026-01-15";
    input.selectedTime = "14:30";

    await input.addTask();

    expect(wrapper.emitted("add-task")).toBeTruthy();
    expect(wrapper.emitted("add-task")[0][0]).toBe("Test Task");
    expect(wrapper.emitted("add-task")[0][1]).toEqual({
      date: "2026-01-15",
      time: "14:30",
    });
  });

  it("does not emit event when task text is empty", async () => {
    const input = wrapper.vm;
    input.taskText = "   ";

    await input.addTask();

    expect(wrapper.emitted("add-task")).toBeFalsy();
  });

  it("clears task text and reminder after adding task", async () => {
    const input = wrapper.vm;
    input.taskText = "Test Task";
    input.selectedDate = "2026-01-15";
    input.selectedTime = "14:30";

    await input.addTask();

    expect(input.taskText).toBe("");
    expect(input.selectedDate).toBe("");
    expect(input.selectedTime).toBe("");
  });

  it("opens date/time dialog when schedule button is clicked", async () => {
    const input = wrapper.vm;
    input.openDateTimeDialog();

    expect(input.showDateTimeDialog).toBe(true);
  });
});
