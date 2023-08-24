<template>
  <div class="wrapper" :data-open="defaultState === 'open' ? 1 : 0">
    <div class="bg" @click="$emit('setState')"></div>
    <div
      ref="card"
      class="card"
      :data-state="isMoving ? 'move' : defaultState"
      :style="{ top: `${isMoving ? y : calcY()}vh` }"
    >
      <div class="pan-area" ref="pan">
        <div class="bar" ref="bar" :style="{ backgroundColor: barColor }"></div>
      </div>
      <div class="contents">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Hammer from "hammerjs";

export default {
  name: "bottom-sheet",

  props: {
    openY: {
      type: Number,
      default: 0.1,
    },

    halfY: {
      type: Number,
      default: 0.8,
    },

    defaultState: {
      type: String,
      default: "close",
    },

    barColor: {
      type: String,
      default: "rgba(0, 0, 0, .3)",
    },

    value: {
      type: String,
      default: "half",
    },

    minState: {
      type: String,
      default: "close",
    },
  },

  data() {
    return {
      mc: null,
      y: 0,
      startY: 0,
      isMoving: false,
      rect: {},
      states: ["close", "half", "open"],
    };
  },

  mounted() {
    window.onresize = () => {
      this.rect = this.$refs.card.getBoundingClientRect();
    };

    this.rect = this.$refs.card.getBoundingClientRect();

    this.mc = new Hammer(this.$refs.pan);
    this.mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });

    this.mc.on("panup pandown", (evt) => {
      this.y = evt.center.y - 16;
    });

    this.mc.on("panstart", (evt) => {
      this.startY = evt.center.y;
      this.isMoving = true;
    });

    this.mc.on("panend", (evt) => {
      this.isMoving = false;
      switch (this.defaultState) {
        case "close": //Added a close state on the condition to be able to swipe from closed to half/closed state.
        case "half":
          if (this.defaultState === "close") {
            if (this.startY - evt.center.y > 120) {
              this.defaultState = "half";
            }
            if (this.startY - evt.center.y > 320) {
              this.defaultState = "open";
            }
            break;
          }
          if (this.startY - evt.center.y > 120) {
            this.defaultState = "open";
          }
          if (this.startY - evt.center.y < -50) {
            this.defaultState = "close";
          }
          break;
        case "open":
          if (this.startY - evt.center.y < -120) {
            this.defaultState = "half";
          }
          break;
        default:
          this.defaultState = "half";
      }

      this.checkForMinState();
    });

    this.checkForMinState();
  },

  beforeUnmount() {
    this.mc.destroy();
    window.onresize = null;
  },

  methods: {
    calcY() {
      switch (this.defaultState) {
        case "close":
          return this.rect.height;
        case "open":
          return 70;
        case "half":
          return this.rect.height;
        default:
          return this.y;
      }
    },

    checkForMinState() {
      if (
        this.states.indexOf(this.defaultState) <
        this.states.indexOf(this.minState)
      ) {
        console.log(this.minState);
      }
    },
  },

  watch: {
    value(newState) {
      this.setState(newState);
    },

    state(newState) {
      if (this.sheetState !== newState) {
        this.$emit("input", newState);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper[data-open="1"] {
  position: fixed;
  top: 0;
  left: 0;
}

.wrapper[data-open="1"] .bg {
  display: block;
  transition: all 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.card {
  width: 100%;
  height: 100vh;
  position: fixed;
  background: white;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -3px 4px rgba(0, 0, 0, 0.1);
  left: 0;
}

.card[data-state="half"],
.card[data-state="open"],
.card[data-state="close"] {
  transition: top 0.3s ease-out;
}

.card[data-state="close"] {
  box-shadow: none;
}

.bar {
  width: 45px;
  height: 8px;
  border-radius: 14px;
  margin: 0 auto;
  cursor: pointer;
}

.pan-area {
  display: none;
  top: 0;
  right: 0;
  left: 0;
  position: absolute;
  padding: 12px 0;
  .bar {
    &:hover {
      cursor: grab;
    }
    &:active {
      cursor: grabbing;
    }
  }
}

.card[data-state="close"] .pan-area {
  top: -28px;
}

.contents {
  margin-top: 28px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  padding-bottom: calc(100vh * 0.2);
  box-sizing: border-box;
}
</style>
