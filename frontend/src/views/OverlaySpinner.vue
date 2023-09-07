<template>
  <div class="overlay-container">
    <div class="spinner-container-wrapper">
      <span class="loader"></span>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spinner-container-wrapper {
  position: relative;
  box-sizing: border-box;
  grid-template-columns: minmax(0, 100%);
  max-width: 375px;
  top: 38%;
  margin: 0 auto;
  color: #545454;
  font-family: inherit;
  background: $white;
  border: 1px solid #ebebeb;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  padding: 67px 28px;
}
p {
  margin-top: 28px;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  /* identical to box height, or 30px */

  text-align: center;
  letter-spacing: 0.01em;

  color: $black;
}

.loader {
  width: 63px;
  height: 63px;
  border: 1px solid #c4c4c4;
  border-bottom: 2px solid #20a936;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}
</style>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "OverlaySpinner",
  props: {
    message: {
      type: String,
      required: false,
    },
  },
});
</script>
