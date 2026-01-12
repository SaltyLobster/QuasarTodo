import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HideButton from "../components/HideButton.vue";

describe("HideButton.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(HideButton, {
      props: {
        showCompleted: true,
      },
      global: {
        stubs: {
          "q-btn": true,
        },
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays correct label when showCompleted is true", () => {
    expect(wrapper.vm.$props.showCompleted).toBe(true);
    const btn = wrapper.findComponent({ name: "QBtn" });
    expect(btn.attributes("label")).toBe("Hide Completed");
  });

  it("displays correct label when showCompleted is false", async () => {
    await wrapper.setProps({ showCompleted: false });
    const btn = wrapper.findComponent({ name: "QBtn" });
    expect(btn.attributes("label")).toBe("Show Completed");
  });

  it("emits toggle-show-completed event when button is clicked", () => {
    wrapper.vm.toggleShowCompleted();
    expect(wrapper.emitted("toggle-show-completed")).toBeTruthy();
  });

  it("shows visibility_off icon when showCompleted is true", () => {
    const props = wrapper.vm.$props;
    expect(props.showCompleted).toBe(true);
  });

  it("shows visibility icon when showCompleted is false", async () => {
    await wrapper.setProps({ showCompleted: false });
    const props = wrapper.vm.$props;
    expect(props.showCompleted).toBe(false);
  });
});
