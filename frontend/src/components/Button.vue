<template>
  <button type="submit" >
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
  },
};
</script>

<style scoped lang="scss">
button {
  outline: none;
  border: none;
  background: $black;
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

    color: $white;
  }
}
</style>
