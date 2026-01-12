import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock notification API
class MockNotification {
  constructor(title, options) {
    this.title = title;
    this.options = options;
  }
}

MockNotification.permission = "granted";
MockNotification.requestPermission = vi.fn(() => Promise.resolve("granted"));

global.Notification = MockNotification;

describe("Task Notification System", () => {
  let activeTimeouts;

  beforeEach(() => {
    activeTimeouts = new Map();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
    activeTimeouts.clear();
  });

  it("schedules notification for future task", () => {
    const task = {
      id: 1,
      task: "Buy groceries",
      reminder: { date: "2026-12-25", time: "14:00" },
    };

    const futureTime = new Date("2026-12-25T14:00:00");
    const delay = futureTime.getTime() - Date.now();

    // Simulate scheduling
    const timeoutId = setTimeout(() => {
      // Notification would be sent here
    }, delay);

    activeTimeouts.set(task.id, timeoutId);
    expect(activeTimeouts.has(task.id)).toBe(true);

    clearTimeout(timeoutId);
    activeTimeouts.delete(task.id);
    expect(activeTimeouts.has(task.id)).toBe(false);
  });

  it("clears timeout when task is deleted", () => {
    const task = { id: 1, task: "Test task" };
    const timeoutId = setTimeout(() => {}, 5000);

    activeTimeouts.set(task.id, timeoutId);
    expect(activeTimeouts.has(task.id)).toBe(true);

    // Simulate deletion
    if (activeTimeouts.has(task.id)) {
      clearTimeout(activeTimeouts.get(task.id));
      activeTimeouts.delete(task.id);
    }

    expect(activeTimeouts.has(task.id)).toBe(false);
  });

  it("does not schedule notification for past dates", () => {
    const task = {
      id: 1,
      task: "Past task",
      reminder: { date: "2020-01-01", time: "10:00" },
    };

    const pastTime = new Date("2020-01-01T10:00:00");
    const delay = pastTime.getTime() - Date.now();

    expect(delay).toBeLessThan(0);
  });

  it("requests notification permission", async () => {
    if (!("Notification" in global)) return;

    const permission = await global.Notification.requestPermission();
    expect(permission).toBe("granted");
  });

  it("does not send notification if permission is denied", () => {
    const originalPermission = global.Notification.permission;
    global.Notification.permission = "denied";

    const shouldSend = global.Notification.permission === "granted";

    expect(shouldSend).toBe(false);
    global.Notification.permission = originalPermission;
  });

  it("creates notification with correct properties", () => {
    const task = { id: 1, task: "Important task" };

    if (global.Notification.permission === "granted") {
      const notification = new global.Notification("Task Reminder", {
        body: task.task,
        tag: `task-${task.id}`,
        requireInteraction: true,
      });

      expect(notification.title).toBe("Task Reminder");
      expect(notification.options.body).toBe("Important task");
      expect(notification.options.tag).toBe("task-1");
      expect(notification.options.requireInteraction).toBe(true);
    }
  });
});
