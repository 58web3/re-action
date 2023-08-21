<template>
  <button :class="!type ? 'primary-button' : 'secondary-button'" type="submit">
    <span>
      {{ text }}
    </span>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    text: {
      type: String,
      default: "",
    },
    type: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
button {
  width: 100%;
  outline: none;
  border: none;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  min-width: 200px;
  max-width: 265px;
  padding: 17px 12px;
  span {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
    /* identical to box height, or 16px */

    text-align: center;
    letter-spacing: 0.1em;

    color: #fff;
  }
}
.primary-button {
  background: $black;
}
.secondary-button {
  background: rgb(194, 193, 193);
}
</style>
