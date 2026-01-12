<script setup>
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Generate hours (0-23) and minutes (0-59)
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const selectedHour = ref("00");
const selectedMinute = ref("00");
const hourScroll = ref(null);
const minuteScroll = ref(null);
const isScrolling = ref(false);

// Parse initial value
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal.includes(":")) {
      const [h, m] = newVal.split(":");
      selectedHour.value = h;
      selectedMinute.value = m;
    }
  },
  { immediate: true }
);

// Update emit when time changes
watch([selectedHour, selectedMinute], () => {
  emit("update:modelValue", `${selectedHour.value}:${selectedMinute.value}`);
});

function scrollToCenter(element, index) {
  if (element) {
    const itemHeight = 40;
    const spacerHeight = 80;
    isScrolling.value = true;
    element.scrollTop =
      spacerHeight +
      index * itemHeight +
      itemHeight / 2 -
      element.clientHeight / 2;
    setTimeout(() => {
      isScrolling.value = false;
    }, 100);
  }
}

function handleHourScroll() {
  if (isScrolling.value) return;
  const itemHeight = 40;
  const spacerHeight = 80;
  const scrollTop = hourScroll.value.scrollTop;
  const index = Math.round(
    (scrollTop +
      hourScroll.value.clientHeight / 2 -
      spacerHeight -
      itemHeight / 2) /
      itemHeight
  );
  selectedHour.value = hours[Math.max(0, Math.min(index, hours.length - 1))];
}

function handleMinuteScroll() {
  if (isScrolling.value) return;
  const itemHeight = 40;
  const spacerHeight = 80;
  const scrollTop = minuteScroll.value.scrollTop;
  const index = Math.round(
    (scrollTop +
      minuteScroll.value.clientHeight / 2 -
      spacerHeight -
      itemHeight / 2) /
      itemHeight
  );
  selectedMinute.value =
    minutes[Math.max(0, Math.min(index, minutes.length - 1))];
}

function setTime(h, m) {
  selectedHour.value = String(h).padStart(2, "0");
  selectedMinute.value = String(m).padStart(2, "0");
  nextTick(() => {
    scrollToCenter(hourScroll.value, h);
    scrollToCenter(minuteScroll.value, m);
  });
}

// Set current time button
function setCurrentTime() {
  const now = new Date();
  setTime(now.getHours(), now.getMinutes());
}

// Handle direct click on hour
function selectHour(hour) {
  const hourIndex = hours.indexOf(hour);
  setTime(hourIndex, parseInt(selectedMinute.value));
}

// Handle direct click on minute
function selectMinute(minute) {
  const minuteIndex = minutes.indexOf(minute);
  setTime(parseInt(selectedHour.value), minuteIndex);
}
</script>

<template>
  <div class="time-picker-container">
    <div class="time-display text-center q-mb-md">
      <div class="text-h4 text-primary">
        {{ selectedHour }}:{{ selectedMinute }}
      </div>
    </div>

    <div class="row justify-center q-gutter-md q-mb-md">
      <!-- Hours Scroller -->
      <div class="time-scroller">
        <div class="scroller-label text-center q-mb-xs">Hours</div>
        <div ref="hourScroll" class="scroller-list" @scroll="handleHourScroll">
          <div class="scroller-spacer"></div>
          <div
            v-for="hour in hours"
            :key="`hour-${hour}`"
            class="scroller-item"
            :class="{ 'selected-item': hour === selectedHour }"
            @click="selectHour(hour)"
          >
            {{ hour }}
          </div>
          <div class="scroller-spacer"></div>
        </div>
      </div>

      <!-- Minutes Scroller -->
      <div class="time-scroller">
        <div class="scroller-label text-center q-mb-xs">Minutes</div>
        <div
          ref="minuteScroll"
          class="scroller-list"
          @scroll="handleMinuteScroll"
        >
          <div class="scroller-spacer"></div>
          <div
            v-for="minute in minutes"
            :key="`minute-${minute}`"
            class="scroller-item"
            :class="{ 'selected-item': minute === selectedMinute }"
            @click="selectMinute(minute)"
          >
            {{ minute }}
          </div>
          <div class="scroller-spacer"></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row justify-center q-gutter-sm">
      <q-btn
        flat
        dense
        size="sm"
        label="Now"
        color="primary"
        @click="setCurrentTime"
      />
    </div>
  </div>
</template>

<style scoped>
.time-picker-container {
  padding: 16px;
}

.time-display {
  font-weight: 600;
}

.time-scroller {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.scroller-label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
}

.scroller-list {
  height: 200px;
  width: 50px;
  overflow-y: scroll;
  scroll-behavior: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f5f5f5;
  position: relative;
}

.scroller-list::-webkit-scrollbar {
  width: 6px;
}

.scroller-list::-webkit-scrollbar-track {
  background: transparent;
}

.scroller-list::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}

.scroller-spacer {
  height: 80px;
  flex-shrink: 0;
}

.scroller-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #666;
  }
}

.selected-item {
  color: #5b91ce;
  font-weight: 700;
  font-size: 22px;
}
</style>
