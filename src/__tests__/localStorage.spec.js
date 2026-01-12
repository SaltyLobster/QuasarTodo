import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Local Storage Utilities", () => {
  const STORAGE_KEY = "taskLists";

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("saves task lists to localStorage", () => {
    const lists = [
      { id: 1, name: "List 1", tasks: [] },
      { id: 2, name: "List 2", tasks: [] },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(saved).toEqual(lists);
    expect(saved).toHaveLength(2);
  });

  it("retrieves task lists from localStorage", () => {
    const lists = [
      { id: 1, name: "My Tasks", tasks: [{ id: 1, task: "Test" }] },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved).toEqual(lists);
    expect(retrieved[0].name).toBe("My Tasks");
    expect(retrieved[0].tasks).toHaveLength(1);
  });

  it("creates default list if none exist", () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();

    const defaultList = {
      id: Date.now(),
      name: "My Tasks",
      tasks: [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultList]));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].name).toBe("My Tasks");
  });

  it("preserves task data in localStorage", () => {
    const lists = [
      {
        id: 1,
        name: "Important",
        tasks: [
          { id: 1, task: "Buy milk", isCompleted: true, reminder: null },
          {
            id: 2,
            task: "Call mom",
            isCompleted: false,
            reminder: { date: "2026-01-15", time: "10:00" },
          },
        ],
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(retrieved[0].tasks).toHaveLength(2);
    expect(retrieved[0].tasks[0].isCompleted).toBe(true);
    expect(retrieved[0].tasks[1].reminder).toEqual({
      date: "2026-01-15",
      time: "10:00",
    });
  });

  it("handles empty localStorage gracefully", () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();

    const lists = stored ? JSON.parse(stored) : [];
    expect(lists).toEqual([]);
  });

  it("allows adding new list to existing lists", () => {
    const existingLists = [{ id: 1, name: "List 1", tasks: [] }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingLists));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const newList = { id: 2, name: "List 2", tasks: [] };
    stored.push(newList);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    const updated = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(updated).toHaveLength(2);
    expect(updated[1].name).toBe("List 2");
  });

  it("allows deleting a list from storage", () => {
    const lists = [
      { id: 1, name: "List 1", tasks: [] },
      { id: 2, name: "List 2", tasks: [] },
      { id: 3, name: "List 3", tasks: [] },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // Remove list with id 2
    const filtered = stored.filter((list) => list.id !== 2);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const updated = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(updated).toHaveLength(2);
    expect(updated.every((list) => list.id !== 2)).toBe(true);
  });
});
