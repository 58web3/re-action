<template>
  <div class="overlay-modal-container">
    <div class="close-modal" @click="close()" v-if="isClosable">
      <img src="@/assets/icons/close.svg" alt="" />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalTemplate",
  methods: {
    close() {
      this.$emit("close");
    },
  },
  props: {
    isClosable: { type: Boolean, default: true },
  },
};
</script>

<style scoped lang="scss">
.overlay-modal-container {
  animation: fadein 1s;
  position: fixed;
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  overflow-y: scroll;
  margin: 0 auto;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  .close-modal {
    padding: 25px;
    color: $white;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    z-index: 1;
  }
  .content {
    margin: 0 auto;
    padding-top: 10vh;
    @media all and (max-width: 750px) {
      padding-top: 5vh;
    }
    @media all and (max-height: 675px) {
      padding-top: 0vh;
    }
  }
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
