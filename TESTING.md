# Unit Testing Guide

## Overview

This project uses **Vitest** as the unit testing framework, with **@vue/test-utils** for component testing. All tests can be run with a single command.

## Running Tests

### Run All Tests (One Time)

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test -- --watch
```

### Run Tests with UI

```bash
npm run test -- --ui
```

### Run Specific Test File

```bash
npm run test -- src/__tests__/InputLine.spec.js
```

## Test Files Overview

### 1. **localStorage.spec.js** (7 tests)

Tests data persistence to browser localStorage:

- ✅ Saves task lists
- ✅ Retrieves task lists
- ✅ Creates default list when none exist
- ✅ Preserves task data structure
- ✅ Handles empty localStorage
- ✅ Adds new lists
- ✅ Deletes lists

### 2. **InputLine.spec.js** (6 tests)

Tests the task input component:

- ✅ Renders the component
- ✅ Emits add-task event without reminder
- ✅ Emits add-task event with reminder
- ✅ Validates empty input
- ✅ Clears state after adding task
- ✅ Opens date/time picker dialog

### 3. **HideButton.spec.js** (6 tests)

Tests the show/hide completed tasks button:

- ✅ Renders the component
- ✅ Displays "Hide Completed" label when tasks are shown
- ✅ Displays "Show Completed" label when tasks are hidden
- ✅ Emits toggle event on click
- ✅ Shows visibility_off icon when showing completed
- ✅ Shows visibility icon when hiding completed

### 4. **TaskList.spec.js** (11 tests)

Tests the task list display and management:

- ✅ Displays all tasks
- ✅ Filters completed tasks based on prop
- ✅ Shows empty state message
- ✅ Emits remove-task event
- ✅ Emits toggle-task event
- ✅ Formats date/time correctly
- ✅ Handles null dates gracefully
- ✅ Opens edit reminder dialog
- ✅ Saves reminder changes
- ✅ Removes reminders
- ✅ Handles reminder formatting

### 5. **notifications.spec.js** (6 tests)

Tests the browser notification system:

- ✅ Schedules notifications correctly
- ✅ Manages notification timeouts
- ✅ Requests notification permissions
- ✅ Handles permission denied state
- ✅ Creates browser notifications
- ✅ Reschedules notifications on page load

## Test Results

```
Test Files  5 passed (5)
Tests       36 passed (36)
Duration    ~2 seconds
```

## Code Coverage

The test suite covers:

- ✅ **Component Rendering**: All components mount and render correctly
- ✅ **Props & Events**: Props are correctly passed and events are emitted
- ✅ **State Management**: Component state updates work as expected
- ✅ **Data Validation**: Input validation and edge cases are handled
- ✅ **Notification System**: Scheduling, permissions, and triggering work correctly
- ✅ **Storage**: LocalStorage persistence is reliable

## Configuration Files

### `vitest.config.js`

- Defines test environment (happy-dom)
- Configures Vue plugin for component testing
- Sets up path aliases for imports
- Enables globals for describe/it/expect

### `package.json`

- `npm test` runs Vitest in run mode
- Vitest and related packages are in devDependencies

## Writing New Tests

### Template

```javascript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import MyComponent from "../components/MyComponent.vue";

describe("MyComponent.vue", () => {
  it("should do something", () => {
    const wrapper = mount(MyComponent, {
      props: {
        /* props */
      },
      global: {
        stubs: {
          /* Quasar components to stub */
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
```

### Best Practices

1. **One assertion per test** - Keep tests focused
2. **Descriptive names** - Test names should describe what they test
3. **Setup & teardown** - Use `beforeEach` and `afterEach`
4. **Mock external APIs** - Use `vi.mock()` for dependencies
5. **Test behavior, not implementation** - Focus on what users see/do

## CI/CD Integration

To add automated testing:

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test
```

## Troubleshooting

### Tests Not Running

```bash
npm install -D vitest @vue/test-utils happy-dom
```

### Vue Warnings in Tests

Some Quasar directives (like `v-close-popup`) may warn in tests - this is expected and doesn't affect test validity.

### Import Errors

Ensure `vitest.config.js` path aliases match your project structure.

## Next Steps

- Run `npm test` to verify all tests pass
- Add more tests as new features are developed
- Consider E2E testing with Cypress/Playwright for full workflows
- Set up CI/CD pipeline for automated testing on push
